import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { IAmostra } from '../interfaces/amostra.interface';

@Injectable()
export class AmostraRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(_data: CreateAmostraDto): Promise<any> {
    const { ensaiosSolicitados, ...amostra } = _data;
    return this.prisma.amostra.create({
      data: {
        ensaiosSolicitados: {
          connect: ensaiosSolicitados.map((id) => ({ id })),
        },
        ...amostra,
      },
      include: {
        ensaiosSolicitados: true,
        user: true,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }
  /*
  async findAll(): Promise<IAmostra[]> {
    return this.prisma.amostra.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(id: number, data: Partial<AmostraDto>): Promise<IAmostra> {
    return this.prisma.amostra.update({
      where: { id },
      data,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async delete(id: number): Promise<IAmostra> {
    return this.prisma.amostra.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<IAmostra | null> {
    return this.prisma.amostra.findUnique({
      where: { id },
      include: {},
      omit: { createdAt: true, updatedAt: true },
    });
  }
    */
}
