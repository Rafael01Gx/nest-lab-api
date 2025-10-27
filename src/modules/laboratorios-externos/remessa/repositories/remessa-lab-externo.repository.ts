import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IRemessaLabExterno } from '../interfaces/remessa-lab-externo.interface';
import { CreateRemessaLabExternoDto } from '../dto/create-remessa-lab-externo.dto';
import { UpdateRemessaLabExternoDto } from '../dto/update-remessa-lab-externo.dto';

@Injectable()
export class RemessaLabExternoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRemessaLabExternoDto): Promise<IRemessaLabExterno> {
    const remessa = await this.prisma.remessaLabExterno.create({
      data: {
        data: new Date(dto.data),
        destinoId: dto.destinoId,
        amostras: {
          create: dto.amostras.map((amostra) => ({
            amostraName: amostra.amostraName,
            dataInicio: amostra.dataInicio,
            dataFim: amostra.dataFim,
            elementosSolicitados: amostra.elementosSolicitados,
            subIdentificacao: amostra.subIdentificacao,
          })),
        },
      },
      include: {
        amostras: true,
        destino: true,
      },
      omit: { createdAt: true, updatedAt: true },
    });
    return remessa;
  }

  async findAll(): Promise<IRemessaLabExterno[]> {
    return this.prisma.remessaLabExterno.findMany({
      include: {
        amostras: true,
        destino: true,
      },
      omit: { createdAt: true, updatedAt: true },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findById(id: number): Promise<IRemessaLabExterno | null> {
    return this.prisma.remessaLabExterno.findFirst({
      where: { id },
      include: {
        amostras: true,
        destino: true,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    dto: UpdateRemessaLabExternoDto,
  ): Promise<IRemessaLabExterno> {
    return this.prisma.remessaLabExterno.update({
      where: { id },
      data: {
        data: dto.data,
        destinoId: dto.destinoId,
      },
      include: {
        amostras: true,
        destino: true,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.remessaLabExterno.delete({
      where: { id },
    });
  }
}
