import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { JwtForgotPasswordStrategy } from './strategy/jwt-forgot-password.strategy';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  exports: [
    //JwtAuthStrategy, //* only using when only have 1 auth guard method
    PassportModule,
  ],
  imports: [
    PassportModule, //*.register({ defaultStrategy: 'jwt' }), //* only using when only have 1 auth guard method
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
