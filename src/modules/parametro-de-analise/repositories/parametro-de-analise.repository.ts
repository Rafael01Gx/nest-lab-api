import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IParametrosAnalise } from '../interfaces/parametro-de-analise.interface';

@Injectable()
export class ParametrosAnaliseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: IParametrosAnalise): Promise<IParametrosAnalise> {
    return this.prisma.parametrosDeAnalise.create({
      data,
      include: {
        tipoDeAnalise: true,
      },
    });
  }

  async findAll(): Promise<IParametrosAnalise[]> {
    return this.prisma.parametrosDeAnalise.findMany({
      include: { tipoDeAnalise: true },
    });
  }

  async update(
    id: string,
    data: Partial<IParametrosAnalise>,
  ): Promise<IParametrosAnalise> {
    return this.prisma.parametrosDeAnalise.update({
      where: { id },
      data,
      include: {
        tipoDeAnalise: true,
      },
    });
  }

  async delete(id: string): Promise<IParametrosAnalise> {
    return this.prisma.parametrosDeAnalise.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<IParametrosAnalise | null> {
    return this.prisma.parametrosDeAnalise.findUnique({
      where: { id },
      include: {
        tipoDeAnalise: true,
      },
    });
  }
}
