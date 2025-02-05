import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JWT_AUTH_STRATEGY_NAME } from '../strategy/jwt-auth.strategy';
import { SKIP_AUTH_META_DATA_KEY } from 'src/config/permission';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard(
  JWT_AUTH_STRATEGY_NAME, // Navigate to the Strategy registered with the name is JWT_AUTH_STRATEGY_NAME
) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTH_META_DATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipAuth) {
      return true;
    }

    return super.canActivate(context);
  }
}
