import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { IAmostra } from '../interfaces/amostra.interface';
import { EStatus } from '@prisma/client';

@Injectable()
export class AmostraRepository {
  constructor(private readonly prisma: PrismaService) {}
  #returnOptions = {
    include: {
      ensaiosSolicitados: true,
      user: {
        omit: {
          password: true,
          role: true,
          passwordResetExpires: true,
          passwordResetToken: true,
          authorization: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    omit: { createdAt: true, updatedAt: true },
  };

  async create(_data: CreateAmostraDto): Promise<any> {
    const { ensaiosSolicitados, ...amostra } = _data;
    return this.prisma.amostra.create({
      data: {
        ensaiosSolicitados: {
          connect: ensaiosSolicitados.map((id) => ({ id })),
        },
        ...amostra,
      },
      ...this.#returnOptions,
    });
  }

  async findAll(): Promise<IAmostra[]> {
    return this.prisma.amostra.findMany({
      ...this.#returnOptions,
    });
  }

  async findAllByUser(userId: string): Promise<IAmostra[]> {
    return this.prisma.amostra.findMany({
      where: { userId },
      ...this.#returnOptions,
    });
  }

  async findById(id: number): Promise<IAmostra | null> {
    return this.prisma.amostra.findUnique({
      where: { id },
      ...this.#returnOptions,
    });
  }

  async updateStatusByOs(numeroOs: string, status: EStatus): Promise<any> {
    return this.prisma.amostra.updateMany({
      where: { numeroOs },
      data: { status },
    });
  }
  /*
  async update(id: number, data: Partial<AmostraDto>): Promise<IAmostra> {
    return this.prisma.amostra.update({
      where: { id },
      data,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async delete(id: number): Promise<IAmostra> {
    return this.prisma.amostra.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<IAmostra | null> {
    return this.prisma.amostra.findUnique({
      where: { id },
      include: {},
      omit: { createdAt: true, updatedAt: true },
    });
  }
    */
}
