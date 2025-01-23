import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard(
  process.env.JWT_AUTH_STRATEGY_NAME,
) {}
