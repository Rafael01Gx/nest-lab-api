import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AmostraLabExternoRepository } from './repositories/amostra-lab-externo.repository';
import { IAmostraLabExterno } from './interfaces/amostra-lab-externo.interface';
import { CreateAmostraLabExternoDto } from './dto/create-amostra-lab-externo.dto';
import { UpdateAmostraLabExternoDto } from './dto/update-amostra-lab-externo.dto';

@Injectable()
export class AmostraLabExternoService {
  constructor(
    private readonly amostraLabExternoRepository: AmostraLabExternoRepository,
  ) {}

  async create(dto: CreateAmostraLabExternoDto): Promise<IAmostraLabExterno> {
    return this.amostraLabExternoRepository.create(dto);
  }

  async findAll(): Promise<IAmostraLabExterno[]> {
    return this.amostraLabExternoRepository.findAll();
  }

  async update(
    id: number,
    dto: UpdateAmostraLabExternoDto,
  ): Promise<IAmostraLabExterno> {
    await this.amostraExists(id);
    return this.amostraLabExternoRepository.update(id, dto);
  }

  async delete(id: number): Promise<any> {
    await this.amostraExists(id);
    return this.amostraLabExternoRepository.delete(id);
  }

  async amostraExists(id: number): Promise<void> {
    const amostraExists = await this.amostraLabExternoRepository.findById(id);
    if (!amostraExists) {
      throw new HttpException(
        'Elemento químico não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
