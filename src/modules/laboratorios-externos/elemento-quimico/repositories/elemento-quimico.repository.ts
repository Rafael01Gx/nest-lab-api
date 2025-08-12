import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateElementoQuimicoDto } from '../dto/create-elemento-quimico.dto';
import { ElementoQuimico } from '../interfaces/elemento-quimico.interface';
import { UpdateElementoQuimicoDto } from '../dto/update-elemento-quimico.dto';

@Injectable()
export class ElementoQuimicoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateElementoQuimicoDto): Promise<ElementoQuimico> {
    return this.prisma.elementoQuimico.create({
      data,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findAll(): Promise<ElementoQuimico[]> {
    return this.prisma.elementoQuimico.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findByNameAndSimbol(
    data: CreateElementoQuimicoDto,
  ): Promise<ElementoQuimico | null> {
    const { elementName, simbolo } = data;
    return this.prisma.elementoQuimico.findFirst({
      where: { elementName, simbolo },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findById(id: number): Promise<ElementoQuimico | null> {
    return this.prisma.elementoQuimico.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(
    id: number,
    data: UpdateElementoQuimicoDto,
  ): Promise<ElementoQuimico> {
    return this.prisma.elementoQuimico.update({
      where: { id },
      data,
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.elementoQuimico.delete({
      where: { id },
    });
  }
}
