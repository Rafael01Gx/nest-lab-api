import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from '../../auth/dto/signup.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Role } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async create(user: SignUpDto) {
    return this.prismaService.user.create({ data: { ...user } });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  async getAll() {
    return this.prismaService.user.findMany({
      omit: {
        password: true,
        passwordResetToken: true,
        passwordResetExpires: true,
      },
    });
  }
  async getAllAdmin(): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: { role: Role.ADMIN },
      omit: {
        password: true,
        passwordResetToken: true,
        passwordResetExpires: true,
      },
    });
  }

  getById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id: id },
      omit: {
        password: true,
        passwordResetToken: true,
        passwordResetExpires: true,
      },
    });
  }

  update(id: string, user: UpdateUserDto): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data: {
        ...user,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        area: true,
        funcao: true,
        authorization: true,
        role: true,
      },
    });
  }

  delete(id: string) {
    return this.prismaService.user.delete({ where: { id: id } });
  }
}
