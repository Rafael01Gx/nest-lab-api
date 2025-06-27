import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TipoAnaliseRepository } from './repositories/tipo-analise.repository';
import { ITipoDeAnalise } from './interfaces/tipo-de-analise.interface';
import { TipoDeAnaliseDto } from './dto/tipo-de-analise.dto';

@Injectable()
export class TipoDeAnaliseService {
  constructor(private readonly tipoAnaliseRepo: TipoAnaliseRepository) {}

  async findAll(): Promise<ITipoDeAnalise[]> {
    return this.tipoAnaliseRepo.findAll();
  }

  async create(dto: TipoDeAnaliseDto) {
    return this.tipoAnaliseRepo.create(dto);
  }
  async update(id: string, dto: TipoDeAnaliseDto) {
    const existingTipoAnalise = await this.tipoAnaliseRepo.findById(id);
    if (!existingTipoAnalise) {
      throw new HttpException(
        'Tipo de analíse não encontrada !',
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
      message: 'Tipo de análise deletada com sucesso!',
    };
  }
}
