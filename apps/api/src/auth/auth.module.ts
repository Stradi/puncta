import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Role } from 'src/common/role/roles.enum';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './graphql-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { PasswordService } from './password.service';

@Module({
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    GqlAuthGuard,
    PasswordService,
    PrismaModule,
  ],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.get('jwt');
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [GqlAuthGuard],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit() {
    Logger.log('Creating default ADMIN user', 'AuthModule');
    try {
      await this.authService.signup(
        {
          email: this.configService.getOrThrow('ADMIN_EMAIL'),
          username: 'admin',
          password: this.configService.getOrThrow('ADMIN_PASSWORD'),
        },
        Role.ADMIN,
      );
      Logger.log(
        'ADMIN user created. You can now login with the credentials you provided',
        'AuthModule',
      );
    } catch (error) {
      Logger.log('ADMIN user already exists', 'AuthModule');
    }
  }
}
