import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { NotificationsGateway } from './notifications.gateway';
import { NotificationsRepository } from './repositories/notifications.repository';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class NotificationsService {
    constructor(
    private readonly repo: NotificationsRepository,
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async createForAdmins(title: string, message: string, data?: string) {
    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    if (admins.length === 0) {
      throw new NotFoundException('Nenhum admin encontrado');
    }

    await this.repo.createMany(
      admins.map((a) => ({ title, message, data, userId: a.id })),
    );

    this.gateway.notifyAdmins({ title, message, data });
  }


  async createForUser(userId: string, title: string, message: string, data?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const notification = await this.repo.create({ 
      title, 
      message, 
      data,
      userId 
    });

    if (this.gateway.isUserOnline(userId)) {
      this.gateway.notifyUser(userId, notification);
    }

    return notification;
  }

  async createForMultipleUsers(
    userIds: string[],
    title: string,
    message: string,
    data?: string,
  ) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });

    if (users.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado');
    }

    const notifications = await this.repo.createMany(
      users.map((u) => ({ title, message, data, userId: u.id })),
    );

    // Notifica apenas usuários online
    const onlineUserIds = userIds.filter(id => this.gateway.isUserOnline(id));
    if (onlineUserIds.length > 0) {
      this.gateway.notifyUsers(onlineUserIds, { title, message, data });
    }

    return notifications;
  }

  async createForAllUsers(title: string, message: string, data?: string) {
    const users = await this.prisma.user.findMany({
      select: { id: true },
    });

    if (users.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado');
    }

    await this.repo.createMany(
      users.map((u) => ({ title, message, data, userId: u.id })),
    );

    this.gateway.notifyAll({ title, message, data });
  }

  async listByUser(userId: string) {
    return this.repo.findAllByUser(userId);
  }

  async findById(id: number, userId: string) {
    const notification = await this.repo.findById(id);

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar esta notificação');
    }

    return notification;
  }

  async markAsRead(id: number, userId: string) {
    const notification = await this.repo.findById(id);

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para marcar esta notificação');
    }

    return this.repo.markAsRead(id);
  }

  async markMultipleAsRead(ids: number[], userId: string) {
    const notifications = await this.repo.findByIds(ids);
    
    const userNotifications = notifications.filter(n => n.userId === userId);
    
    if (userNotifications.length === 0) {
      throw new NotFoundException('Nenhuma notificação encontrada');
    }

    const validIds = userNotifications.map(n => n.id);
    return this.repo.markMultipleAsRead(validIds);
  }

  async deleteNotification(id: number, userId: string) {
    const notification = await this.repo.findById(id);

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para deletar esta notificação');
    }

    await this.repo.delete(id);
  }

  async deleteMultiple(ids: number[], userId: string) {
    const notifications = await this.repo.findByIds(ids);
    
    const userNotifications = notifications.filter(n => n.userId === userId);
    
    if (userNotifications.length === 0) {
      throw new NotFoundException('Nenhuma notificação encontrada');
    }

    const validIds = userNotifications.map(n => n.id);
    await this.repo.deleteMultiple(validIds);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repo.countUnread(userId);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async getStats() {
    const [total, unread, read] = await Promise.all([
      this.repo.count(),
      this.repo.countAllUnread(),
      this.repo.countAllRead(),
    ]);

    const onlineUsers = this.gateway.getConnectionStats();

    return {
      notifications: {
        total,
        unread,
        read,
      },
      websocket: onlineUsers,
    };
  }
}