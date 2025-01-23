import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UserRepository } from '../users/repository/user.repository';
import { JwtAuthPayLoad } from './interface/jwt-auth-payload.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(signInDto: SignInDto) {
    const user = await UserRepository.validateUser(signInDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtAuthPayLoad = {
      fullName: user.firstName.trim() + ' ' + user.lastName.trim(),
      id: user.id,
    };
    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { accessToken: token };
  }
}
