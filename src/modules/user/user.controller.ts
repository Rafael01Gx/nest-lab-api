import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get()
  getAll() {
    return 'getAllUsers';
  }

  @Get(':id')
  getById() {
    return 'getUserById';
  }

  @Patch(':id')
  update() {
    return 'updateUser';
  }

  @Patch('status/:id')
  updateStatus() {
    return 'updateUserStatus';
  }

  @Delete(':id')
  delete() {
    return 'deleteUser';
  }

  @Post('forgot-password')
  forgotPassword() {
    return 'forgotPassword';
  }

  @Post('reset-password')
  resetPassword() {
    return 'resetPassword';
  }
}
