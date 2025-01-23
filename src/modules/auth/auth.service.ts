import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UserRepository } from '../users/repository/user.repository';
import { JwtPayLoad } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(signInDto: SignInDto) {
    const user = await UserRepository.validateUser(signInDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayLoad = {
      fullName: user.firstName.trim() + ' ' + user.lastName.trim(),
      id: user.id,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { accessToken: token };
  }
}
