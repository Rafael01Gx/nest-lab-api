import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ParametrosAnaliseRepository } from './repositories/parametro-analise.repository';
import { IParametrosAnalise } from './interfaces/parametro-analise.interface';
import { TipoAnaliseRepository } from '../tipo-de-analise/repositories/tipo-analise.repository';
import { ParametrosAnaliseDto } from './dto/parametro-analise.dto';

@Injectable()
export class ParametrosAnaliseService {
  constructor(
    private readonly paramAnaliseRepo: ParametrosAnaliseRepository,
    private readonly tipoAnaliseRepo: TipoAnaliseRepository,
  ) {}

  async findAll(): Promise<IParametrosAnalise[]> {
    return this.paramAnaliseRepo.findAll();
  }

  async create(dto: ParametrosAnaliseDto): Promise<IParametrosAnalise> {
    await this.verifyAnalysisType(dto.tipoAnaliseId);
    return this.paramAnaliseRepo.create(dto);
  }

  async update(id: number, dto: IParametrosAnalise) {
    const existingparamAnalise = await this.paramAnaliseRepo.findById(id);
    if (!existingparamAnalise) {
      throw new HttpException(
        'Parâmetro não encontrado!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!dto.tipoAnaliseId) return;
    await this.verifyAnalysisType(dto.tipoAnaliseId);

    const updateDto = {
      tipoAnaliseId: dto.tipoAnaliseId,
      descricao: dto.descricao ?? '',
      unidadeMedida: dto.unidadeMedida ?? '',
      casasDecimais: dto.casasDecimais ?? 0,
      unidadeResultado: dto.unidadeResultado ?? '',
    };
    return this.paramAnaliseRepo.update(id, updateDto);
  }

  async delete(id: number) {
    await this.paramAnaliseRepo.delete(id);
    return {
      message: 'Parâmetro deletado com sucesso!',
    };
  }

  async verifyAnalysisType(id: number): Promise<void> {
    const existTipoAnalise = await this.tipoAnaliseRepo.findById(id);
    if (!existTipoAnalise) {
      throw new HttpException(
        'Tipo de análise inválido!',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
