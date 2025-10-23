import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfiguracaoAnaliseRepository } from './repositories/configuracao-analise.repository';
import { IConfiguracaoAnalise } from './interfaces/configuracao-analise.interface';
import { UpdateConfigAnaliseDto } from './dto/update-config-analise.dto';
import { CreateConfigAnaliseDto } from './dto/create-config-analise.dto';
import { TipoAnaliseRepository } from '../tipos-de-analises/repositories/tipo-analise.repository';
import { MateriaPrimaRepository } from '../materias-primas/repositories/materia-prima.repository';
import { ParametrosAnaliseRepository } from '../parametros-analises/repositories/parametro-analise.repository';

@Injectable()
export class ConfiguracaoAnaliseService {
  constructor(
    private readonly configuracaoAnaliseRepo: ConfiguracaoAnaliseRepository,
    private readonly tipoAnaliseRepo: TipoAnaliseRepository,
    private readonly materiaPrimaRepo: MateriaPrimaRepository,
    private readonly paramAnaliseRepo: ParametrosAnaliseRepository,
  ) {}

  async create(dto: CreateConfigAnaliseDto): Promise<IConfiguracaoAnalise> {
    await this.isValidConfig(dto);
    return this.configuracaoAnaliseRepo.create(dto);
  }

  async findAll(): Promise<IConfiguracaoAnalise[]> {
    return this.configuracaoAnaliseRepo.findAll();
  }

  async findByTipoAnaliseId(
    tipoAnaliseId: number,
  ): Promise<Partial<IConfiguracaoAnalise>[] | null> {
    const tipoAnalise = await this.tipoAnaliseRepo.findById(tipoAnaliseId);
    if (!tipoAnalise) {
      throw new HttpException('Análise inválida!', HttpStatus.NOT_FOUND);
    }
    return this.configuracaoAnaliseRepo.findByTipoAnaliseId(tipoAnaliseId);
  }

  async update(
    id: number,
    dto: UpdateConfigAnaliseDto,
  ): Promise<IConfiguracaoAnalise> {
    const existingConfiguracaoAnalise =
      await this.configuracaoAnaliseRepo.findById(id);
    if (!existingConfiguracaoAnalise) {
      throw new HttpException(
        'Configuracão não encontrada!',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.isValidConfig(dto);
    const updateDto = {
      nomeDescricao: dto.nomeDescricao,
      tipoAnaliseId: dto.tipoAnaliseId,
      parametros: dto.parametros,
    };
    return this.configuracaoAnaliseRepo.update(id, updateDto);
  }

  async delete(id: number) {
    await this.configuracaoAnaliseRepo.delete(id);
    return {
      message: 'Configuração deletada com sucesso!',
    };
  }

  async isValidConfig(dto: CreateConfigAnaliseDto): Promise<void> {
    const tipoAnalise = await this.tipoAnaliseRepo.findById(dto.tipoAnaliseId);
    if (!tipoAnalise) {
      throw new HttpException('Análise inválida!', HttpStatus.NOT_FOUND);
    }

    const parametros = await Promise.all(
      dto.parametros.map((id) => this.paramAnaliseRepo.findById(id)),
    );

    parametros.forEach((param, i) => {
      if (!param) {
        throw new HttpException(
          `Parâmetro ${dto.parametros[i]} inválido!`,
          HttpStatus.NOT_FOUND,
        );
      }
    });
    return;
  }
}
