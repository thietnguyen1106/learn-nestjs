import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { JwtForgotPasswordStrategy } from './strategy/jwt-forgot-password.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  exports: [PassportModule],
  imports: [
    // PassportModule.register({ defaultStrategy: process.env.JWT_AUTH_STRATEGY_NAME }), //* only using when only have 1 auth guard method
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    RolesModule,
    PermissionsModule,
  ],
  providers: [AuthService, JwtAuthStrategy, JwtForgotPasswordStrategy],
})
export class AuthModule {}
