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
import { ROUTES } from '../../common/constants/routes.constant';

const { NOTIFICACOES } = ROUTES;

@Controller(NOTIFICACOES.BASE)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(NOTIFICACOES.GET.GET_MY_NOTIFICATIONS)
  async getMyNotifications(@CurrentUser() user: User) {
    return this.notificationsService.listByUser(user);
  }

  @Get(NOTIFICACOES.GET.GET_UNREAD_COUNT)
  async getUnreadCount(@CurrentUser() user: User) {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  @Get(NOTIFICACOES.GET.GET_ALL_NOTIFICATIONS_ADMIN)
  @Roles(Role.ADMIN)
  async getAllNotifications() {
    return this.notificationsService.findAll();
  }

  @Get(NOTIFICACOES.GET.GET_NOTIFICATION_STATS_ADMIN)
  @Roles(Role.ADMIN)
  async getNotificationStats() {
    return this.notificationsService.getStats();
  }

  @Get(NOTIFICACOES.GET.GET_NOTIFICATION_BY_ID)
  async getNotificationById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.findById(id, user.id);
  }




  @Post(NOTIFICACOES.POST.NOTIFY_ALL_ADMINS)
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

  @Post(NOTIFICACOES.POST.NOTIFY_USER_ADMIN)
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

  @Post(NOTIFICACOES.POST.NOTIFY_MULTIPLE_USERS_ADMIN)
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

  @Post(NOTIFICACOES.POST.NOTIFY_ALL_USERS_ADMIN)
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

  @Patch(NOTIFICACOES.PATCH.MARK_ALL_AS_READ)
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(
    @Body() dto: MarkMultipleAsReadDto,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markMultipleAsRead(dto.ids, user.id);
  }


  @Patch(NOTIFICACOES.PATCH.MARK_AS_READ)
  @HttpCode(HttpStatus.OK)
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Delete(NOTIFICACOES.DELETE.CLEAR_READ_NOTIFICATIONS)
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearReadNotifications(
    @Body() dto: MarkMultipleAsReadDto,
    @CurrentUser() user: User,
  ) {
    await this.notificationsService.deleteMultiple(dto.ids, user.id);
  }

  @Delete(NOTIFICACOES.DELETE.DELETE_NOTIFICATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNotification(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    await this.notificationsService.deleteNotification(id, user.id);
  }
}
