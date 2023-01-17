import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { SignupInput } from './dto/signup.input';
import { Auth } from './entities/auth.entity';
import { Token } from './entities/token.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args() args: SignupInput) {
    args.email = args.email.toLowerCase();
    const { accessToken, refreshToken } = await this.authService.signup(args);

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
}
