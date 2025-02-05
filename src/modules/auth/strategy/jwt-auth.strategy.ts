import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Omit, omit } from 'lodash';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CONSTANTS } from 'src/config/constants';
import { User } from 'src/modules/users/entities/user.entity';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { JwtAuthPayLoad } from '../interface/jwt-auth-payload.interface';
import { UserRepository } from '../../users/repository/user.repository';

export const JWT_AUTH_STRATEGY_NAME = 'jwt-auth-strategy';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  JWT_AUTH_STRATEGY_NAME,
) {
  constructor() {
    super({
      // // Custom source to get token value
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request: Request) => {
      //     return request?.cookies?.Authentication;
      //   },
      // ]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtAuthPayLoad): Promise<Omit<User, string>> {
    const { id } = payload;

    const user = await UserRepository.findOne({
      relations: ['roles', 'permissions'],
      where: { id, status: EntityStatus.ACTIVE },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return omit(user, CONSTANTS.SENSITIVE_FIELDS);
  }
}
