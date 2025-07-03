import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TipoAnaliseDto } from '../dto/tipo-analise.dto';

@Injectable()
export class TipoAnaliseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TipoAnaliseDto): Promise<TipoAnaliseDto> {
    return this.prisma.tipoAnalise.create({
      data,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findAll(): Promise<TipoAnaliseDto[]> {
    return this.prisma.tipoAnalise.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    data: Partial<TipoAnaliseDto>,
  ): Promise<TipoAnaliseDto> {
    return this.prisma.tipoAnalise.update({
      where: { id },
      data,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async delete(id: number): Promise<TipoAnaliseDto> {
    return this.prisma.tipoAnalise.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<TipoAnaliseDto | null> {
    return this.prisma.tipoAnalise.findUnique({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }
}
