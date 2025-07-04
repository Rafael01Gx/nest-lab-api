import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Request } from 'express';
import { UserPayload } from '../auth/types/user-payload.type';
import { Role } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, req.user as UserPayload, body);
  }

  @Roles(Role.ADMIN)
  @Patch('status/:id')
  updateStatus(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateStatusAndRole(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword() {
    return 'forgotPassword';
  }

  @Public()
  @Post('reset-password')
  resetPassword() {
    return 'resetPassword';
  }
}
