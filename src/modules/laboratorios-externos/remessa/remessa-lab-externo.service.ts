import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RemessaLabExternoRepository } from './repositories/remessa-lab-externo.repository';
import { UpdateRemessaLabExternoDto } from './dto/update-remessa-lab-externo.dto';
import { CreateRemessaLabExternoDto } from './dto/create-remessa-lab-externo.dto';
import { IRemessaLabExterno } from './interfaces/remessa-lab-externo.interface';
import { QueryDto } from 'src/shared/dto/query.dto';

@Injectable()
export class RemessaLabExternoService {
  constructor(
    private readonly remessaLabExternoRepository: RemessaLabExternoRepository,
  ) {}

  async create(dto: CreateRemessaLabExternoDto): Promise<IRemessaLabExterno> {
    dto.amostras.forEach((amostra) => {
      if (new Date(amostra.dataFim) < new Date(amostra.dataInicio)) {
        throw new HttpException(
          `A data Final não pode ser anterior à data de início para a amostra "${amostra.amostraName}".`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    return this.remessaLabExternoRepository.create(dto);
  }

  async findAll(query:QueryDto): Promise<any> {
    return this.remessaLabExternoRepository.findAll(query);
  }

  async update(
    id: number,
    dto: UpdateRemessaLabExternoDto,
  ): Promise<IRemessaLabExterno> {
    await this.remessaExists(id);
    return this.remessaLabExternoRepository.update(id, dto);
  }

  async delete(id: number): Promise<any> {
    await this.remessaExists(id);
    return this.remessaLabExternoRepository.delete(id);
  }

  async remessaExists(id: number): Promise<void> {
    const remessaExists = await this.remessaLabExternoRepository.findById(id);
    if (!remessaExists) {
      throw new HttpException('Remessa não encontrada', HttpStatus.NOT_FOUND);
    }
  }
}
