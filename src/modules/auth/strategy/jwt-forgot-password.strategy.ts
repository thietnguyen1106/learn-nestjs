import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRepository } from '../../users/repository/user.repository';
import { JwtForgotPasswordPayLoad } from '../interface/jwt-forgot-password-payload.interface';

@Injectable()
export class JwtForgotPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-forgot-password-strategy',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtForgotPasswordPayLoad): Promise<User> {
    const { email } = payload;
    const user = await UserRepository.findOneBy({
      email,
      status: EntityStatus.ACTIVE,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
