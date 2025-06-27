import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TipoDeAnaliseDto } from '../dto/tipo-de-analise.dto';

@Injectable()
export class TipoAnaliseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: TipoDeAnaliseDto): Promise<TipoDeAnaliseDto> {
    return this.prisma.tipoDeAnalise.create({
      data,
    });
  }

  async findAll(): Promise<TipoDeAnaliseDto[]> {
    return this.prisma.tipoDeAnalise.findMany();
  }

  async update(
    id: string,
    data: Partial<TipoDeAnaliseDto>,
  ): Promise<TipoDeAnaliseDto> {
    return this.prisma.tipoDeAnalise.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<TipoDeAnaliseDto> {
    return this.prisma.tipoDeAnalise.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<TipoDeAnaliseDto | null> {
    return this.prisma.tipoDeAnalise.findUnique({
      where: { id },
    });
  }
}
