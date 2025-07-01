import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ParametrosAnaliseRepository } from './repositories/parametro-de-analise.repository';
import { IParametrosAnalise } from './interfaces/parametro-de-analise.interface';
import { TipoAnaliseRepository } from '../tipo-de-analise/repositories/tipo-analise.repository';

@Injectable()
export class ParametrosAnaliseService {
  constructor(
    private readonly paramAnaliseRepo: ParametrosAnaliseRepository,
    private readonly tipoAnaliseRepo: TipoAnaliseRepository,
  ) {}

  async findAll(): Promise<IParametrosAnalise[]> {
    return this.paramAnaliseRepo.findAll();
  }

  async create(dto: IParametrosAnalise) {
    await this.verifyAnalysisType(dto.tipo_de_analise_id);
    return this.paramAnaliseRepo.create(dto);
  }

  async update(id: string, dto: IParametrosAnalise) {
    const existingparamAnalise = await this.paramAnaliseRepo.findById(id);
    if (!existingparamAnalise) {
      throw new HttpException(
        'Parâmetro não encontrado!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (dto.tipo_de_analise_id) {
      await this.verifyAnalysisType(dto.tipo_de_analise_id);
    }
    const updateDto = {
      tipo_de_analise_id: dto.tipo_de_analise_id,
      descricao: dto.descricao,
      unidade_de_medida: dto.unidade_de_medida,
    };
    return this.paramAnaliseRepo.update(id, updateDto);
  }

  async delete(id: string) {
    await this.paramAnaliseRepo.delete(id);
    return {
      message: 'Parâmetro deletado com sucesso!',
    };
  }

  async verifyAnalysisType(id: string): Promise<void> {
    const existTipoAnalise = await this.tipoAnaliseRepo.findById(id);
    if (!existTipoAnalise) {
      throw new HttpException(
        'Tipo de análise inválido!',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
