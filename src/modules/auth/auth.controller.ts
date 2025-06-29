import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signin(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(body, res);
  }

  @Post('register')
  signup(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token');
    return { message: 'Logged out successfully' };
  }
}
