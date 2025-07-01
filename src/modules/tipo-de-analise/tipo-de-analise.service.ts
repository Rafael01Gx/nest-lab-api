import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TipoAnaliseRepository } from './repositories/tipo-analise.repository';
import { ITipoAnalise } from './interfaces/tipo-de-analise.interface';
import { TipoAnaliseDto } from './dto/tipo-de-analise.dto';

@Injectable()
export class TipoAnaliseService {
  constructor(private readonly tipoAnaliseRepo: TipoAnaliseRepository) {}

  async findAll(): Promise<ITipoAnalise[]> {
    return this.tipoAnaliseRepo.findAll();
  }

  async create(dto: TipoAnaliseDto) {
    return this.tipoAnaliseRepo.create(dto);
  }
  async update(id: string, dto: TipoAnaliseDto) {
    const existingTipoAnalise = await this.tipoAnaliseRepo.findById(id);
    if (!existingTipoAnalise) {
      throw new HttpException(
        'Tipo de analíse não encontrado!',
        HttpStatus.NOT_FOUND,
      );
    }
    const updateDto = {
      tipo: dto.tipo,
      classe: dto.classe,
    };
    return this.tipoAnaliseRepo.update(id, updateDto);
  }

  async delete(id: string) {
    await this.tipoAnaliseRepo.delete(id);
    return {
      message: 'Tipo de análise deletado com sucesso!',
    };
  }
}
