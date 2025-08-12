import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IOrdemServico } from './interfaces/ordem-servico.interface';
import { CreateOrdemServicoDto } from './dto/ordem-servico.dto';
import { OrdemServicoRepository } from './repositories/ordem-servico.repository';
import { IAmostra } from '../amostra/interfaces/amostra.interface';
import { ITipoAnalise } from '../tipo-de-analise/interfaces/tipo-analise.interface';
import { User } from '../user/entities/user.entity';
import { ulid } from 'ulid';

@Injectable()
export class OrdemServicoService {
  constructor(
    private readonly ordemServicoRepository: OrdemServicoRepository,
  ) {}

  async create(dto: CreateOrdemServicoDto, user: User): Promise<IOrdemServico> {
    if (!dto.amostras || dto.amostras.length === 0) {
      throw new HttpException(
        'Amostras não podem ser vazias!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const numeroOs = ulid();
    const amostras: IAmostra[] = [];
    dto.amostras.forEach((amostra: IAmostra) => {
      const nomeAmostra = amostra?.nomeAmostra;
      const dataAmostra = amostra?.dataAmostra;
      const ensaiosSolicitados = amostra?.ensaiosSolicitados.map(
        (ensaio: ITipoAnalise | number) => {
          if (typeof ensaio === 'object') {
            return ensaio.id;
          }
          return null;
        },
      );
      const newAmostra = {
        numeroOs,
        nomeAmostra,
        dataAmostra,
        ensaiosSolicitados,
        userId: user.id,
      };
      amostras.push(newAmostra as IAmostra);
    });
    const newOrdemServico = {
      id: numeroOs,
      solicitanteId: user.id,
      amostras,
    };
    return this.ordemServicoRepository.create(newOrdemServico as IOrdemServico);
  }

  /*
  async findAll(): Promise<IOrdemServico[]> {
    return this.configuracaoAnaliseRepo.findAll();
  }

  async update(id: number, dto: UpdateOrdemServicoDto): Promise<IOrdemServico> {
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

  async isValidConfig(dto: OrdemServicoDto): Promise<void> {
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
  }*/
}
