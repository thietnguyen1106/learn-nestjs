import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtForgotPasswordGuard extends AuthGuard(
  process.env.JWT_FORGOT_PASSWORD_STRATEGY_NAME,
) {}
