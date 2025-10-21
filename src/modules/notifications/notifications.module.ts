import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './repositories/notifications.repository';
import { NotificationsController } from './notifications.controler';

@Module({
    controllers: [NotificationsController],
  providers: [NotificationsGateway, NotificationsService,NotificationsRepository ,PrismaService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
