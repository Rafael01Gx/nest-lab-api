import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AmostraAnaliseExternaRepository } from './repositories/amostra-analise-externa.repository';
import { UpdateAmostraAnaliseExternaDto } from './dto/update-amostra-analise-externa.dto';
import {
  FiltrosAnalytics,
  IAmostraAnaliseExterna,
} from './interfaces/amostra-analise-externa.interface';
import { AmostraAnaliseExternaQueryDto } from './dto/amostra-analise-externa-query.dto';

@Injectable()
export class AmostraAnaliseExternaService {
  constructor(
    private readonly amostraAnaliseExternaRepository: AmostraAnaliseExternaRepository,
  ) {}

  async findAll(query: AmostraAnaliseExternaQueryDto): Promise<IAmostraAnaliseExterna[]> {
    return this.amostraAnaliseExternaRepository.findAll(query);
  }

  async update(
    id: number,
    dto: UpdateAmostraAnaliseExternaDto,
  ): Promise<IAmostraAnaliseExterna> {
    await this.amostraExists(id);
    return this.amostraAnaliseExternaRepository.update(id, dto);
  }

  async amostraExists(id: number): Promise<void> {
    const amostraExists = await this.amostraAnaliseExternaRepository.findById(id);
    if (!amostraExists) {
      throw new HttpException(
        'Amostra não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
  }


  async findAllForDashboard(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.findAllForAnalytics(filtros);
  }

  async getEstatisticasGerais(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getEstatisticasGerais(filtros);
  }

  async getEstatisticasPorLaboratorio(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getEstatisticasPorLaboratorio(filtros);
  }

  async getEstatisticasPorRemessa(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getEstatisticasPorRemessa(filtros);
  }

  async getEstatisticasElementos(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getEstatisticasElementos(filtros);
  }

  async getDashboardCompleto(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getDashboardCompleto(filtros);
  }
}
