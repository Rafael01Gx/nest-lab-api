import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Role, User } from '@prisma/client';
import { MarkMultipleAsReadDto } from './dto/mark-multiple-as-read.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notificacoes')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('all')
  async getMyNotifications(@CurrentUser() user: User) {
    return this.notificationsService.listByUser(user);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(
    @Body() dto: MarkMultipleAsReadDto,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markMultipleAsRead(dto.ids, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    await this.notificationsService.deleteNotification(id, user.id);
  }

  @Delete('clear-read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearReadNotifications(
    @Body() dto: MarkMultipleAsReadDto,
    @CurrentUser() user: User,
  ) {
    await this.notificationsService.deleteMultiple(dto.ids, user.id);
  }

  @Get('unread/count')
  async getUnreadCount(@CurrentUser() user: User) {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  @Get(':id')
  async getNotificationById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.findById(id, user.id);
  }

  // ============= ROTAS ADMIN =============

  @Post('admin/broadcast')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async notifyAllAdmins(@Body() dto: CreateNotificationDto) {
    await this.notificationsService.createForAdmins(
      dto.title,
      dto.message,
      dto.data,
    );
    return { message: 'Notificação enviada para todos os admins' };
  }

  @Post('admin/user')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async notifyUser(@Body() dto: CreateNotificationDto) {
    const notification = await this.notificationsService.createForUser(
      dto.userId,
      dto.title,
      dto.message,
      dto.data,
    );
    return notification;
  }

  @Post('admin/users')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async notifyMultipleUsers(
    @Body()
    dto: {
      userIds: string[];
      title: string;
      message: string;
      data?: string;
    },
  ) {
    await this.notificationsService.createForMultipleUsers(
      dto.userIds,
      dto.title,
      dto.message,
      dto.data,
    );
    return {
      message: `Notificação enviada para ${dto.userIds.length} usuários`,
    };
  }

  @Post('admin/broadcast-all')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async notifyAllUsers(@Body() dto: CreateNotificationDto) {
    await this.notificationsService.createForAllUsers(
      dto.title,
      dto.message,
      dto.data,
    );
    return { message: 'Notificação enviada para todos os usuários' };
  }

  @Get('admin/all')
  @Roles(Role.ADMIN)
  async getAllNotifications() {
    return this.notificationsService.findAll();
  }

  @Get('admin/stats')
  @Roles(Role.ADMIN)
  async getNotificationStats() {
    return this.notificationsService.getStats();
  }
}
