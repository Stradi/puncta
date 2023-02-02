import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/common/role/roles.enum';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { SignupInput } from './dto/signup.input';
import { Auth } from './entities/auth.entity';
import { IsExists } from './entities/is-exists.entity';
import { Token } from './entities/token.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args() args: SignupInput) {
    args.email = args.email.toLowerCase();
    if (!args.role) {
      args.role = Role.STUDENT;
    }

    if (args.role === Role.ADMIN) {
      throw new UnauthorizedException(
        'You are not allowed to create an admin account',
      );
    } else if (args.role === Role.TEACHER && !args.teacher) {
      throw new GenericInvalidParameterError(
        'teacher',
        'Teacher field is required for teacher role',
      );
    } else if (
      args.role === Role.STUDENT &&
      (!args.university || !args.faculty)
    ) {
      throw new GenericInvalidParameterError(
        ['university', 'faculty'],
        'University and faculty fields are required for student role',
      );
    }

    const { accessToken, refreshToken } = await this.authService.signup(
      args,
      args.role,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(@Args() args: LoginInput) {
    const { accessToken, refreshToken } = await this.authService.login(args);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() args: RefreshTokenInput) {
    return this.authService.refreshToken(args);
  }

  @Query(() => IsExists)
  async isEmailExists(@Args('email') email: string) {
    const response = await this.authService.isEmailExists(email);
    return response ? { result: true } : { result: false };
  }
}
