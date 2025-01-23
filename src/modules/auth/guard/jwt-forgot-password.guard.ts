import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtForgotPasswordGuard extends AuthGuard(
  'jwt-forgot-password-strategy',
) {}
