import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_FORGOT_PASSWORD_STRATEGY_NAME } from '../strategy/jwt-forgot-password.strategy';

@Injectable()
export class JwtForgotPasswordGuard extends AuthGuard(
  JWT_FORGOT_PASSWORD_STRATEGY_NAME, // Navigate to the Strategy registered with the name is JWT_FORGOT_PASSWORD_STRATEGY_NAME
) {}
