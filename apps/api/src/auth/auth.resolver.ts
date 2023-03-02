import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { Role } from 'src/common/role/roles.enum';
import { GenericInvalidParameterError } from 'src/shared/shared.exceptions';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { SignupInput } from './dto/signup.input';
import { Auth } from './entities/auth.entity';
import { IsExists } from './entities/is-exists.entity';
import { Token } from './entities/token.entity';
import { GqlAuthGuard } from './graphql-auth.guard';

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

  @Query(() => IsExists)
  async isUsernameExists(@Args('username') username: string) {
    const response = await this.authService.isUsernameExists(username);
    return response ? { result: true } : { result: false };
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
    @UserEntity() user: User,
  ) {
    return this.authService.changePassword(oldPassword, newPassword, user);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async changeAnonymity(
    @Args('anonymity') anonymity: boolean,
    @UserEntity() user: User,
  ) {
    return this.authService.changeAnonymity(anonymity, user);
  }
}
