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
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { ROUTES } from '../../common/constants/routes.constant';

const { USER } = ROUTES;

@Controller(USER.BASE)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get(USER.GET.GET_ALL)
  getAll() {
    return this.userService.getAll();
  }

  @Get(USER.GET.GET_BY_ID)
  getById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Patch(USER.PATCH.UPDATE)
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(id, user, dto);
  }

  @Roles(Role.ADMIN)
  @Patch(USER.PATCH.UPDATE_STATUS)
  updateStatus(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateStatusAndRole(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(USER.DELETE.DELETE)
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Public()
  @Post(USER.POST.FORGOT_PASSWORD)
  forgotPassword() {
    return 'forgotPassword';
  }

  @Public()
  @Post(USER.POST.RESET_PASSWORD)
  resetPassword() {
    return 'resetPassword';
  }
}
