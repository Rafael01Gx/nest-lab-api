import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IParametrosAnalise } from '../interfaces/parametro-analise.interface';

@Injectable()
export class ParametrosAnaliseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: IParametrosAnalise): Promise<IParametrosAnalise> {
    return this.prisma.parametrosAnalise.create({
      data,
      include: {
        tipoAnalise: true,
      },
    });
  }

  async findAll(): Promise<IParametrosAnalise[]> {
    return this.prisma.parametrosAnalise.findMany({
      include: { tipoAnalise: true },
    });
  }

  async update(
    id: string,
    data: Partial<IParametrosAnalise>,
  ): Promise<IParametrosAnalise> {
    return this.prisma.parametrosAnalise.update({
      where: { id },
      data,
      include: {
        tipoAnalise: true,
      },
    });
  }

  async delete(id: string): Promise<IParametrosAnalise> {
    return this.prisma.parametrosAnalise.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<IParametrosAnalise | null> {
    return this.prisma.parametrosAnalise.findUnique({
      where: { id },
      include: {
        tipoAnalise: true,
      },
    });
  }
}
