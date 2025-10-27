import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAmostraLabExternoDto } from '../dto/create-amostra-lab-externo.dto';
import { IAmostraLabExterno } from '../interfaces/amostra-lab-externo.interface';
import { UpdateAmostraLabExternoDto } from '../dto/update-amostra-lab-externo.dto';

@Injectable()
export class AmostraLabExternoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAmostraLabExternoDto): Promise<IAmostraLabExterno> {
    return this.prisma.amostraLabExterno.create({
      data: {
        amostraName: dto.amostraName,
        elementosAnalisados: {
          connect: dto.elementosAnalisados.map((id) => ({ id })),
        },
      },
      include: {
        elementosAnalisados: true,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findAll(): Promise<IAmostraLabExterno[]> {
    return this.prisma.amostraLabExterno.findMany({
      include: {
        elementosAnalisados: true,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findById(id: number): Promise<IAmostraLabExterno | null> {
    return this.prisma.amostraLabExterno.findFirst({
      where: { id },
      include: {
        elementosAnalisados: true,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    dto: UpdateAmostraLabExternoDto,
  ): Promise<IAmostraLabExterno> {
    return this.prisma.amostraLabExterno.update({
      where: { id },
      data: {
        amostraName: dto.amostraName,
        elementosAnalisados: {
          set: [],
          connect: dto.elementosAnalisados?.map((id) => ({ id })),
        },
      },
      include: {
        elementosAnalisados: true,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.amostraLabExterno.delete({
      where: { id },
    });
  }
}
