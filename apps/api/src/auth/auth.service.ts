import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupInput } from './dto/signup.input';
import { Token } from './entities/token.entity';
import { PasswordService } from './password.service';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Role } from 'src/common/role/roles.enum';
import { convertArgsToWhereClause } from 'src/shared/utils/prisma.utils';
import { JwtConfig } from '../common/config/config.types';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async signup(args: SignupInput, role: Role = Role.STUDENT) {
    const hashedPassword = await this.passwordService.hashPassword(
      args.password,
    );

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
          password: hashedPassword,
          role: role || Role.STUDENT,
          university: {
            connect: convertArgsToWhereClause(
              ['id', 'slug', 'name'],
              args.university,
            ),
          },
          faculty: {
            connect: convertArgsToWhereClause(
              ['id', 'slug', 'name'],
              args.faculty,
            ),
          },
        },
      });

      return this.generateTokens({ id: user.id.toString() });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(`Email already exists`);
        }
      }

      throw e;
    }
  }

  async login(args: LoginInput) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: args.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await this.passwordService.comparePassword(
      args.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({ id: user.id.toString() });
  }

  async getUserFromToken(token: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = this.jwtService.decode(token)['id'];
    return await this.prismaService.user.findUnique({
      where: {
        id: Number.parseInt(id),
      },
    });
  }

  async validateUser(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: Number.parseInt(id),
      },
      include: {
        ratings: true,
        university: true,
        faculty: true,
      },
    });
  }

  async isEmailExists(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  refreshToken(args: RefreshTokenInput) {
    try {
      const { id } = this.jwtService.verify(args.token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({ id });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private generateTokens(payload: { id: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { id: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { id: string }): string {
    const jwtConfig = this.configService.get<JwtConfig>('jwt');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: jwtConfig?.refreshIn,
    });
  }
}
