import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Omit, omit } from 'lodash';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { EntityStatus } from 'src/common/enum/entity-status.enum';
import { JwtPayLoad } from '../interface/jwt-payload.interface';
import { UserRepository } from '../../users/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-auth-strategy',
) {
  constructor() {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
      //   return request?.cookies?.Authentication;
      // }]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(
    payload: JwtPayLoad,
  ): Promise<Omit<User, 'password' | 'salt'>> {
    const { id } = payload;

    const user = await UserRepository.findOne({
      relations: ['roles', 'permissions'],
      where: { id, status: EntityStatus.ACTIVE },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return omit(user, ['password', 'salt']);
  }
}
