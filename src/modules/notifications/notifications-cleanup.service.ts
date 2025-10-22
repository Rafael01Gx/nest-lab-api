import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class NotificationsCleanupService {
  private readonly logger = new Logger(NotificationsCleanupService.name);

  constructor(private prisma: PrismaService) {}


  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldNotifications() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      const result = await this.prisma.notifications.deleteMany({
        where: {
          data: {
            lt: oneWeekAgo,
          },
        },
      });

      this.logger.log(
        `Limpeza concluída: ${result.count} notificações removidas`,
      );
    } catch (error) {
      this.logger.error('Erro ao limpar notificações antigas', error);
    }
  }
}