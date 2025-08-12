import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLaboratorioDto } from '../dto/create-laboratorio.dto';
import { ILaboratorio } from '../interfaces/laboratorio.interface';
import { UpdateLaboratorioDto } from '../dto/update-laboratorio.dto';

@Injectable()
export class LaboratorioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLaboratorioDto): Promise<ILaboratorio> {
    return this.prisma.laboratorio.create({
      data: {
        nome: dto.nome,
        endereco: { ...dto.endereco },
        telefone: dto.telefone,
        email: dto.email,
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findAll(): Promise<ILaboratorio[]> {
    return this.prisma.laboratorio.findMany({
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async findById(id: number): Promise<ILaboratorio | null> {
    return this.prisma.laboratorio.findFirst({
      where: { id },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async update(id: number, dto: UpdateLaboratorioDto): Promise<ILaboratorio> {
    const { nome, endereco, telefone, email } = dto;
    return this.prisma.laboratorio.update({
      where: { id },
      data: { nome, endereco: { ...endereco }, telefone, email },
      omit: { createdAt: true, updatedAt: true },
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.laboratorio.delete({
      where: { id },
    });
  }
}
