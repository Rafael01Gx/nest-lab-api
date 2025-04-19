import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signin(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('register')
  signup(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }
}
