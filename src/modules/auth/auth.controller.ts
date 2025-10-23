import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROUTES } from '../../common/constants/routes.constant';

const {AUTH} = ROUTES;

@Controller(AUTH.BASE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(AUTH.POST.LOGIN)
  login(@Body() body: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(body, res);
  }

  @Roles(Role.ADMIN)
  @Post(AUTH.POST.REGISTER)
  signup(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Public()
  @Post(AUTH.POST.LOGOUT)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @Get(AUTH.GET.PROFILE)
  currentUser(@CurrentUser() user: User) {
    return { user };
  }
}
