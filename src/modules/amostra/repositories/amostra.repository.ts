import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { IAmostra } from '../interfaces/amostra.interface';
import { EStatus } from '@prisma/client';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';
import { AmostraQueryDto } from '../dto/amostra-servico-query.dto';

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

  async findAll(query: AmostraQueryDto): Promise<IAmostra[]> {
    const { status, prazoInicioFim } = query;
    const statusFilter = status
      ? Array.isArray(status)
        ? { in: status }
        : { equals: status }
      : undefined;
    const prazo = prazoInicioFim?.includes('TRUE') ? { not: '' } : undefined;
    return this.prisma.amostra.findMany({
      where: { status: statusFilter, prazoInicioFim: prazo },
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
  async updateRecepcaoAgendamento(
    data: Partial<UpdateAmostraDto>,
  ): Promise<IAmostra> {
    const { prazoInicioFim, dataRecepcao, status } = data;
    return this.prisma.amostra.update({
      where: { id: data.id },
      data: {
        prazoInicioFim,
        dataRecepcao,
        status,
      },
      ...this.#returnOptions,
    });
  }

  async update(id: number, dto: UpdateAmostraDto): Promise<IAmostra> {
    return this.prisma.amostra.update({
      where: { id },
      data: {
        analistas: dto.analistas,
        progresso: dto.progresso,
        resultados: dto.resultados,
        status: dto.status,
      },
      ...this.#returnOptions,
    });
  }
  /*
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
