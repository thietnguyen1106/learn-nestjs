import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Omit, omit } from 'lodash';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from '../../users/repository/user.repository';
import { JwtForgotPasswordPayLoad } from '../interface/jwt-forgot-password-payload.interface';

export const JWT_FORGOT_PASSWORD_STRATEGY_NAME = 'jwt-forgot-password-strategy';

@Injectable()
export class JwtForgotPasswordStrategy extends PassportStrategy(
  Strategy,
  JWT_FORGOT_PASSWORD_STRATEGY_NAME,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(
    payload: JwtForgotPasswordPayLoad,
  ): Promise<Omit<User, 'password' | 'salt'>> {
    const { email } = payload;
    const user = await UserRepository.findOneBy({
      email,
      status: EntityStatus.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return omit(user, ['password', 'salt']);
  }
}
