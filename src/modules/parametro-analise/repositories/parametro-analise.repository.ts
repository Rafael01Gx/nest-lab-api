import { ParametrosAnaliseDto } from './../dto/parametro-analise.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IParametrosAnalise } from '../interfaces/parametro-analise.interface';

@Injectable()
export class ParametrosAnaliseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ParametrosAnaliseDto): Promise<IParametrosAnalise> {
    return this.prisma.parametrosAnalise.create({
      data,
      include: {
        tipoAnalise: {
          select: {
            id: true,
            tipo: true,
            classe: true,
          },
        },
      },
      omit: { tipoAnaliseId: true, createdAt: true, updatedAt: true },
    });
  }

  async findAll(): Promise<IParametrosAnalise[]> {
    return this.prisma.parametrosAnalise.findMany({
      omit: { tipoAnaliseId: true, createdAt: true, updatedAt: true },
      include: {
        tipoAnalise: {
          select: {
            id: true,
            tipo: true,
            classe: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    data: Partial<IParametrosAnalise>,
  ): Promise<IParametrosAnalise> {
    return this.prisma.parametrosAnalise.update({
      where: { id },
      data,
      omit: { tipoAnaliseId: true, createdAt: true, updatedAt: true },
      include: {
        tipoAnalise: {
          select: {
            id: true,
            tipo: true,
            classe: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<IParametrosAnalise> {
    return this.prisma.parametrosAnalise.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<IParametrosAnalise | null> {
    return this.prisma.parametrosAnalise.findUnique({
      where: { id },
      omit: { tipoAnaliseId: true, createdAt: true, updatedAt: true },
      include: {
        tipoAnalise: {
          select: {
            id: true,
            tipo: true,
            classe: true,
          },
        },
      },
    });
  }
}
