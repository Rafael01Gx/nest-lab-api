import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}


  async create(data: CreateNotificationDto) {
    return this.prisma.notifications.create({
      data: {
        title: data.title,
        message: data.message,
        userId: data.userId,
        read: false,
      },
    });
  }

  async createMany(data: CreateNotificationDto[]) {
    return this.prisma.notifications.createMany({
      data: data.map(d => ({
        title: d.title,
        message: d.message,
        userId: d.userId,
        read: false,
      })),
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.notifications.findMany({
      where: { userId },
      orderBy: { data: 'desc' },
    });
  }

  async findById(id: number) {
    return this.prisma.notifications.findUnique({
      where: { id },
    });
  }

  async findByIds(ids: number[]) {
    return this.prisma.notifications.findMany({
      where: { id: { in: ids } },
    });
  }

  async findAll() {
    return this.prisma.notifications.findMany({
      orderBy: { data: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async markAsRead(id: number) {
    return this.prisma.notifications.update({
      where: { id },
      data: { read: true },
    });
  }

  async markMultipleAsRead(ids: number[]) {
    return this.prisma.notifications.updateMany({
      where: { id: { in: ids } },
      data: { read: true },
    });
  }

  async delete(id: number) {
    return this.prisma.notifications.delete({
      where: { id },
    });
  }

  async deleteMultiple(ids: number[]) {
    return this.prisma.notifications.deleteMany({
      where: { id: { in: ids } },
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.prisma.notifications.count({
      where: { userId, read: false },
    });
  }

  async count(): Promise<number> {
    return this.prisma.notifications.count();
  }

  async countAllUnread(): Promise<number> {
    return this.prisma.notifications.count({
      where: { read: false },
    });
  }

  async countAllRead(): Promise<number> {
    return this.prisma.notifications.count({
      where: { read: true },
    });
  }
}
