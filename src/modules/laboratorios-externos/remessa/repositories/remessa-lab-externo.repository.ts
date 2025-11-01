import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IRemessaLabExterno } from '../interfaces/remessa-lab-externo.interface';
import { CreateRemessaLabExternoDto } from '../dto/create-remessa-lab-externo.dto';
import { UpdateRemessaLabExternoDto } from '../dto/update-remessa-lab-externo.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { PaginatedResponse } from 'src/shared/dto/interfaces/paginated-response.interface';

@Injectable()
export class RemessaLabExternoRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateRemessaLabExternoDto): Promise<IRemessaLabExterno> {
    const remessa = await this.prisma.remessaLabExterno.create({
      data: {
        data: dto.data,
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

  async findAll(query: QueryDto): Promise<PaginatedResponse<IRemessaLabExterno[]>> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [data , total ] = await this.prisma.$transaction([
      this.prisma.remessaLabExterno.findMany({
        take:limit,
        skip,
      include: {
        amostras: true,
        destino: true,
      },
      omit: { createdAt: true, updatedAt: true },
      orderBy: {
        id: 'desc',
      },
    }),
    this.prisma.remessaLabExterno.count({})
    ])

    return {
      data,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
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
