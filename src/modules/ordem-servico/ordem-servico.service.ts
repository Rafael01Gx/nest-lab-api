import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IOrdemServico } from './interfaces/ordem-servico.interface';
import { CreateOrdemServicoDto } from './dto/ordem-servico.dto';
import { OrdemServicoRepository } from './repositories/ordem-servico.repository';
import { IAmostra } from '../amostra/interfaces/amostra.interface';
import { ITipoAnalise } from '../tipo-de-analise/interfaces/tipo-analise.interface';
import { User } from '../user/entities/user.entity';
import { ulid } from 'ulid';
import { UserRepository } from '../user/repositories/user.repository';
import { EStatus } from '@prisma/client';
import { AmostraRepository } from '../amostra/repositories/amostra.repository';
import { OrdemServicoQueryDto } from './dto/ordem-servico-query.dto';
import { UpdateOrdemServicoDto } from './dto/update-ordem-servico.dto';

@Injectable()
export class OrdemServicoService {
  constructor(
    private readonly ordemServicoRepository: OrdemServicoRepository,
    private readonly userRepository: UserRepository,
    private readonly amostraRepository: AmostraRepository,
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

  async findAll(): Promise<IOrdemServico[]> {
    return this.ordemServicoRepository.findAll();
  }

  async findAllByUser(
    user: User,
    query: OrdemServicoQueryDto,
  ): Promise<IOrdemServico[]> {
    if (!user || !user.id) {
      throw new HttpException('Usuário inválido!', HttpStatus.BAD_REQUEST);
    }
    const userExist = await this.userRepository.getById(user.id);

    if (!userExist) {
      throw new HttpException('Usuário não encontrado!', HttpStatus.NOT_FOUND);
    }

    return this.ordemServicoRepository.findAllByUser(user.id, query);
  }

  async updateStatus(
    id: string,
    dto: UpdateOrdemServicoDto,
  ): Promise<IOrdemServico> {
    const existingOrdemServico = await this.ordemServicoRepository.findById(id);
    if (!existingOrdemServico) {
      throw new HttpException(
        'Ordem de Serviço não encontrada!',
        HttpStatus.NOT_FOUND,
      );
    }
    if (dto.status) {
      await this.checkAndUpdateStatus(existingOrdemServico, dto.status);
    }
    return this.ordemServicoRepository.updateStatus(
      id,
      dto.status,
      dto.observacao,
    );
  }

  async getEstatisticas() {
    const total = await this.ordemServicoRepository.countAll();
    const porStatus = await this.ordemServicoRepository.countByStatus();
    const porMes = await this.ordemServicoRepository.countByMonth();
    return { total, porStatus, porMes };
  }

  /*

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

  async checkAndUpdateStatus(ordem: IOrdemServico, status: EStatus) {
    switch (status) {
      case EStatus.AUTORIZADA:
        if (ordem.status !== EStatus.AGUARDANDO) {
          throw new HttpException(
            'Apenas ordens com status AGUARDANDO podem ser autorizadas',
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.amostraRepository.updateStatusByOs(
          ordem.id,
          EStatus.AUTORIZADA,
        );
        break;
      case EStatus.CANCELADA:
        if (
          ordem.status === EStatus.CANCELADA ||
          ordem.status === EStatus.FINALIZADA
        ) {
          throw new HttpException(
            'Ordem já está CANCELADA ou CONCLUÍDA',
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.amostraRepository.updateStatusByOs(
          ordem.id,
          EStatus.CANCELADA,
        );
        break;
      case EStatus.FINALIZADA:
        if (
          ordem.status === EStatus.AGUARDANDO ||
          ordem.status === EStatus.CANCELADA
        ) {
          throw new HttpException(
            'Apenas ordens com status AUTORIZADA ou em EXECUCAO podem ser concluídas',
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.amostraRepository.updateStatusByOs(
          ordem.id,
          EStatus.CANCELADA,
        );
        break;
      case EStatus.EXECUCAO:
        if (ordem.status !== EStatus.AUTORIZADA) {
          throw new HttpException(
            'Apenas ordens com status AUTORIZADA podem entrar em EXECUCAO',
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.amostraRepository.updateStatusByOs(
          ordem.id,
          EStatus.EXECUCAO,
        );
        break;
      default:
        throw new HttpException('Status inválido', HttpStatus.BAD_REQUEST);
    }
  }
}
