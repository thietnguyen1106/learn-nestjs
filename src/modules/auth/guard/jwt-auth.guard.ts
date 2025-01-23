import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_AUTH_STRATEGY_NAME } from '../strategy/jwt-auth.strategy';

@Injectable()
export class JwtAuthGuard extends AuthGuard(
  JWT_AUTH_STRATEGY_NAME, // Navigate to the Strategy registered with the name is JWT_AUTH_STRATEGY_NAME
) {}
