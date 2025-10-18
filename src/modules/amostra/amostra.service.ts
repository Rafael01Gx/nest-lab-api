import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAmostraDto } from './dto/update-amostra.dto';
import { CreateAmostraDto } from './dto/create-amostra.dto';
import { AmostraRepository } from './repositories/amostra.repository';
import { IAmostra } from './interfaces/amostra.interface';
import { User } from '../user/entities/user.entity';
import { AmostraQueryDto } from './dto/amostra-servico-query.dto';
import { OrdemServicoRepository } from '../ordem-servico/repositories/ordem-servico.repository';

@Injectable()
export class AmostraService {
  constructor(private readonly amostraRepository: AmostraRepository,
              private readonly ordemServicoRepository: OrdemServicoRepository) {}

  findAll(query: AmostraQueryDto): Promise<IAmostra[]> {
    return this.amostraRepository.findAll(query);
  }

  findById(id: number): Promise<IAmostra | null> {
    return this.amostraRepository.findById(id);
  }

  findAllByUser(user: User): Promise<IAmostra[]> {
    if (!user || !user.id) {
      throw new HttpException('User ID is required', 400);
    }
    return this.amostraRepository.findAllByUser(user.id);
  }

  create(dto: CreateAmostraDto) {
    return dto;
  }

  async update(
    id: number,
    dto: UpdateAmostraDto,
    user: User,
  ): Promise<IAmostra> {
    const amostraExists = await this.findById(id);
    if (!amostraExists) {
      throw new HttpException('Amostra não encontrada', HttpStatus.NOT_FOUND);
    }
    if (amostraExists.status === 'AUTORIZADA' && dto.status == 'EXECUCAO') {
      const os = await this.ordemServicoRepository.findById(amostraExists.numeroOs);
      if (!os) {
        throw new HttpException('Ordem de Serviço não encontrada', HttpStatus.NOT_FOUND);
      }
     const os_status = 'EXECUCAO';
      await this.ordemServicoRepository.updateStatus(os.id, os_status);
    }

    if (!dto.analistas) dto.analistas = [];
    dto.analistas.push(user.id);
    const analistas = new Set(dto.analistas);
    const progresso = this.calculaProgresso(dto);
    const updateAmostra: UpdateAmostraDto = {
      ...dto,
      analistas: [...analistas],
      progresso: progresso,
      status: dto.status,
    };

    return this.amostraRepository.update(id, updateAmostra);
  }

  async findAllWithUsers(query: AmostraQueryDto, user: User) {
    return this.amostraRepository.findAllWithUsers(query, user.id);
  }

  delete(id: number) {
    return id;
  }

  calculaProgresso(amostra: UpdateAmostraDto): number {
    const numEnsaios = amostra.ensaiosSolicitados.length;
    const numResultados = Object.keys(
      amostra.resultados as Record<string, object>,
    ).length;
    return (numResultados * 100) / numEnsaios;
  }
}
