import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TipoAnaliseDto } from '../dto/tipo-de-analise.dto';

@Injectable()
export class TipoAnaliseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TipoAnaliseDto): Promise<TipoAnaliseDto> {
    return this.prisma.tipoAnalise.create({
      data,
    });
  }

  async findAll(): Promise<TipoAnaliseDto[]> {
    return this.prisma.tipoAnalise.findMany();
  }

  async update(
    id: string,
    data: Partial<TipoAnaliseDto>,
  ): Promise<TipoAnaliseDto> {
    return this.prisma.tipoAnalise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TipoAnaliseDto> {
    return this.prisma.tipoAnalise.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<TipoAnaliseDto | null> {
    return this.prisma.tipoAnalise.findUnique({
      where: { id },
    });
  }
}
