import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IConfiguracaoAnalise } from '../interfaces/configuracao-analise.interface';
import { CreateConfigAnaliseDto } from '../dto/create-config-analise.dto';
import { UpdateConfigAnaliseDto } from '../dto/update-config-analise.dto';

@Injectable()
export class ConfiguracaoAnaliseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(_data: CreateConfigAnaliseDto): Promise<IConfiguracaoAnalise> {
    const { parametros, ...configAnalise } = _data;
    return this.prisma.configuracaoAnalise.create({
      data: {
        materiaPrimaId: configAnalise.materiaPrimaId,
        tipoAnaliseId: configAnalise.tipoAnaliseId,
        parametros: {
          connect: parametros.map((id) => ({ id })),
        },
      },
      include: {
        materiaPrima: true,
        tipoAnalise: true,
        parametros: true,
      },
      omit: {
        tipoAnaliseId: true,
        materiaPrimaId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAll(): Promise<IConfiguracaoAnalise[]> {
    return this.prisma.configuracaoAnalise.findMany({
      include: {
        materiaPrima: true,
        tipoAnalise: true,
        parametros: true,
      },
      omit: {
        tipoAnaliseId: true,
        materiaPrimaId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    id: number,
    _data: UpdateConfigAnaliseDto,
  ): Promise<IConfiguracaoAnalise> {
    const { parametros, ...configAnalise } = _data;
    return this.prisma.configuracaoAnalise.update({
      where: { id },
      data: {
        materiaPrimaId: configAnalise.materiaPrimaId,
        tipoAnaliseId: configAnalise.tipoAnaliseId,
        parametros: {
          connect: parametros.map((id) => ({ id })),
        },
      },
      include: {
        materiaPrima: true,
        tipoAnalise: true,
        parametros: true,
      },
      omit: {
        tipoAnaliseId: true,
        materiaPrimaId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.configuracaoAnalise.delete({
      where: { id },
    });
    return;
  }

  async findById(id: number): Promise<IConfiguracaoAnalise | null> {
    return this.prisma.configuracaoAnalise.findUnique({
      where: { id },
      include: {
        materiaPrima: true,
        tipoAnalise: true,
        parametros: true,
      },
      omit: {
        tipoAnaliseId: true,
        materiaPrimaId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
