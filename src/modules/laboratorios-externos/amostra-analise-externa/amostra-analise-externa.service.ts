import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AmostraAnaliseExternaRepository } from './repositories/amostra-analise-externa.repository';
import { UpdateAmostraAnaliseExternaDto } from './dto/update-amostra-analise-externa.dto';
import {
  ElementoResultado,
  FiltrosAnalytics,
  IAmostraAnaliseExterna,
} from './interfaces/amostra-analise-externa.interface';
import { AmostraAnaliseExternaQueryDto } from './dto/amostra-analise-externa-query.dto';
import { UpdateManyDto } from './dto/update-many.dto';
import { AnaliseAlcalisZincoRepository } from './repositories/analise-alcalis-zinco.repository';

@Injectable()
export class AmostraAnaliseExternaService {
  constructor(
    private readonly amostraAnaliseExternaRepository: AmostraAnaliseExternaRepository,
    private readonly analiseAlcalisZincoRepository: AnaliseAlcalisZincoRepository
  ) { }

  async findAll(
    query: AmostraAnaliseExternaQueryDto,
  ): Promise<IAmostraAnaliseExterna[]> {
    return this.amostraAnaliseExternaRepository.findAll(query);
  }
  async findAllWithResults(
    query: AmostraAnaliseExternaQueryDto,
  ): Promise<IAmostraAnaliseExterna[]> {
    return this.amostraAnaliseExternaRepository.findAllWithResults(query);
  }

  async update(
    id: number,
    dto: UpdateAmostraAnaliseExternaDto,
  ): Promise<IAmostraAnaliseExterna> {
    await this.amostraExists(id);
    const amostra = await this.amostraAnaliseExternaRepository.update(id, dto);
    await this.createAndUpdateAlcalisZinco(dto, amostra);

    return amostra
  }

  async createAndUpdateAlcalisZinco(dto: UpdateAmostraAnaliseExternaDto, amostra: IAmostraAnaliseExterna): Promise<any> {
    try {
      if (dto.analiseConcluida && dto.elementosAnalisados?.length) {
        const ELEMENTOS_VALIDOS = ["K2O", "NA2O", "ZN"];
        const elementos = (dto.elementosAnalisados as ElementoResultado[]).reduce((acc, el) => {
          const elementoPadronizado = String(el.elemento).trim().replaceAll('₂', '2').toUpperCase();

          if (ELEMENTOS_VALIDOS.includes(elementoPadronizado)) {
            const unidade = el.unidade?.trim().toLocaleUpperCase();
            let value = el.valor?.trim().replace(',', '.');
            if ((/[a-z]/i.test(value)) || value.includes('-')) {
              value = 'null'
            }
            if (value.includes("<")) {
              value = value.replace("<", "");
              value = `${Number(value) - 0.0001}`
            }
            if (unidade == "PPM" && value !== 'null') {
              value = `${Number(value) / 10000}`
            }
            acc[el.elemento.replaceAll('₂', '2')] = value == 'null' || value == '' ? null : value;
          }
          return acc;
        }, {} as Record<string, string | null>);

        if (Object.keys(elementos).length > 0 && Object.values(elementos).every((v)=> v !== null)) {
          return this.analiseAlcalisZincoRepository.upsert(amostra, elementos);
        }

      }
      else if (!dto.analiseConcluida) {
        return this.analiseAlcalisZincoRepository.deleteMany(amostra.id)
      }
    } catch {
      throw new HttpException('Erro ao criar elementos AlcalisZinco', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateMany(dto: UpdateManyDto): Promise<IAmostraAnaliseExterna[]> {
    const allPromisse = dto.amostras.map(async (amostra) => {
      if (!amostra.id) {
        throw new HttpException(`Amostra não encontrada`, HttpStatus.NOT_FOUND);
      }
      await this.amostraExists(amostra.id);
      return this.amostraAnaliseExternaRepository.update(amostra.id, {
        ...amostra,
      });
    });

    const amostrasUpdated = (await Promise.all(
      allPromisse,
    )) as IAmostraAnaliseExterna[];

    return amostrasUpdated;
  }

  async amostraExists(id: number): Promise<void> {
    const amostraExists =
      await this.amostraAnaliseExternaRepository.findById(id);
    if (!amostraExists) {
      throw new HttpException('Amostra não encontrada', HttpStatus.NOT_FOUND);
    }
  }

  async findAllForDashboard(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.findAllForAnalytics(filtros);
  }

  async getEstatisticasGerais(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getEstatisticasGerais(filtros);
  }

  async getEstatisticasPorLaboratorio(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getEstatisticasPorLaboratorio(
      filtros,
    );
  }

  async getEstatisticasPorRemessa(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getEstatisticasPorRemessa(
      filtros,
    );
  }

  async getEstatisticasElementos(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getEstatisticasElementos(
      filtros,
    );
  }

  async getDashboardCompleto(filtros?: FiltrosAnalytics) {
    return this.amostraAnaliseExternaRepository.getDashboardCompleto(filtros);
  }
}
