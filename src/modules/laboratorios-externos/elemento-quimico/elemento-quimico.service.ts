import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateElementoQuimicoDto } from './dto/create-elemento-quimico.dto';
import { UpdateElementoQuimicoDto } from './dto/update-elemento-quimico.dto';
import { ElementoQuimicoRepository } from './repositories/elemento-quimico.repository';
import { ElementoQuimico } from './interfaces/elemento-quimico.interface';

@Injectable()
export class ElementoQuimicoService {
  constructor(
    private readonly elementoQuimicoRepository: ElementoQuimicoRepository,
  ) {}

  async create(dto: CreateElementoQuimicoDto): Promise<ElementoQuimico> {
    const elementExists =
      await this.elementoQuimicoRepository.findByNameAndSimbol(dto);
    if (elementExists) {
      throw new HttpException(
        'Elemento químico já existe',
        HttpStatus.CONFLICT,
      );
    }

    return this.elementoQuimicoRepository.create(dto);
  }

  async findAll(): Promise<ElementoQuimico[]> {
    return this.elementoQuimicoRepository.findAll();
  }

  async update(
    id: number,
    dto: UpdateElementoQuimicoDto,
  ): Promise<ElementoQuimico> {
    await this.elementExists(id);
    return this.elementoQuimicoRepository.update(id, dto);
  }

  async delete(id: number): Promise<any> {
    await this.elementExists(id);
    return this.elementoQuimicoRepository.delete(id);
  }

  async elementExists(id: number): Promise<void> {
    const elementExists = await this.elementoQuimicoRepository.findById(id);
    if (!elementExists) {
      throw new HttpException(
        'Elemento químico não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
