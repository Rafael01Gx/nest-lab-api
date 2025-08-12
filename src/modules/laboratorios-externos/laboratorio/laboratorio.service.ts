import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LaboratorioRepository } from './repositories/laboratorio.repository';
import { CreateLaboratorioDto } from './dto/create-laboratorio.dto';
import { ILaboratorio } from './interfaces/laboratorio.interface';
import { UpdateLaboratorioDto } from './dto/update-laboratorio.dto';

@Injectable()
export class LaboratorioService {
  constructor(private readonly laboratorioRepository: LaboratorioRepository) {}

  async create(dto: CreateLaboratorioDto): Promise<ILaboratorio> {
    return this.laboratorioRepository.create(dto);
  }

  async findAll(): Promise<ILaboratorio[]> {
    return this.laboratorioRepository.findAll();
  }

  async update(id: number, dto: UpdateLaboratorioDto): Promise<ILaboratorio> {
    await this.labtExists(id);
    return this.laboratorioRepository.update(id, dto);
  }

  async delete(id: number): Promise<any> {
    await this.labtExists(id);
    return this.laboratorioRepository.delete(id);
  }

  async labtExists(id: number): Promise<void> {
    const labtExists = await this.laboratorioRepository.findById(id);
    if (!labtExists) {
      throw new HttpException(
        'Laboratório não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
