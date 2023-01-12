import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './graphql-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { PasswordService } from './password.service';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy, GqlAuthGuard, PasswordService, PrismaModule],
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
export class AuthModule {}
