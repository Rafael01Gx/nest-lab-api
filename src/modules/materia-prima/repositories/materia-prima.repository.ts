import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MateriaPrimaDto } from '../dto/materia-prima.dto';

@Injectable()
export class MateriaPrimaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: MateriaPrimaDto): Promise<MateriaPrimaDto> {
    return this.prisma.materiaPrima.create({
      data,
    });
  }

  async findAll(): Promise<MateriaPrimaDto[]> {
    return this.prisma.materiaPrima.findMany();
  }

  async update(
    id: string,
    data: Partial<MateriaPrimaDto>,
  ): Promise<MateriaPrimaDto> {
    return this.prisma.materiaPrima.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<MateriaPrimaDto> {
    return this.prisma.materiaPrima.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<MateriaPrimaDto | null> {
    return this.prisma.materiaPrima.findUnique({
      where: { id },
    });
  }
}
