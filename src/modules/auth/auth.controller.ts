import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body(ValidationPipe) signInDto: SignInDto): Promise<any> {
    const auth = await this.authService.signIn(signInDto);

    return auth;
  }
}
