import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAmostraDto } from './dto/update-amostra.dto';
import { CreateAmostraDto } from './dto/create-amostra.dto';
import { AmostraRepository } from './repositories/amostra.repository';
import { IAmostra } from './interfaces/amostra.interface';
import { User } from '../user/entities/user.entity';
import { AmostraQueryDto } from './dto/amostra-servico-query.dto';
import { OrdemServicoRepository } from '../ordem-servico/repositories/ordem-servico.repository';
import { EStatus } from '@prisma/client';
import { AgendaQueryDto } from './dto/agenda-query.dto';
import { MailService } from 'src/mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AmostraService {
  constructor(
    private readonly amostraRepository: AmostraRepository,
    private readonly ordemServicoRepository: OrdemServicoRepository,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(query: AmostraQueryDto): Promise<IAmostra[]> {
    return this.amostraRepository.findAll(query);
  }

  async findById(id: number): Promise<IAmostra | null> {
    return this.amostraRepository.findById(id);
  }

  async findAllByUser(user: User): Promise<IAmostra[]> {
    if (!user || !user.id) {
      throw new HttpException('User ID is required', 400);
    }
    return this.amostraRepository.findAllByUser(user.id);
  }

  async create(dto: CreateAmostraDto) {
    return dto;
  }
  async getAgendamentoSemanal(query: AgendaQueryDto) {
    return this.amostraRepository.getAgendamentoSemanal(query);
  }

  async getEstatisticas() {
    return this.amostraRepository.getEstatisticas();
  }

  async getAmostraDetalhes(id: number) {
    return this.amostraRepository.getAmostraDetalhes(id);
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
    if (amostraExists.status === 'FINALIZADA') {
      throw new HttpException(
        'Não é possível alterar esta amostra. O registro já foi finalizadoAmostra Bloqueada. Após a assinatura/validação, as modificações são impedidas para garantir a integridade do laudo.',
        HttpStatus.FORBIDDEN,
      );
    }
    if (amostraExists.status === 'AUTORIZADA' && dto.status == 'EXECUCAO') {
      const os = await this.ordemServicoRepository.findById(
        amostraExists.numeroOs,
      );
      if (!os) {
        throw new HttpException(
          'Ordem de Serviço não encontrada',
          HttpStatus.NOT_FOUND,
        );
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

  async assinar(id: number, user: User): Promise<IAmostra> {
    const amostraExists = await this.findById(id);
    const userId = user.id;
    if (!amostraExists) {
      throw new HttpException('Amostra não encontrada', HttpStatus.NOT_FOUND);
    }
    if (amostraExists.status === 'FINALIZADA') {
      throw new HttpException(
        'Não é possível alterar esta amostra. O registro já foi finalizadoAmostra Bloqueada. Após a assinatura/validação, as modificações são impedidas para garantir a integridade do laudo.',
        HttpStatus.FORBIDDEN,
      );
    }
    if (
      !(amostraExists.status === 'EXECUCAO' && amostraExists.progresso === 100)
    ) {
      throw new HttpException(
        'Amostra não possui requisitos para ser assinada.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const os = await this.ordemServicoRepository.findById(
      amostraExists.numeroOs,
    );
    if (!os) {
      throw new HttpException(
        'Ordem de Serviço não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
    const amostras = await this.amostraRepository.findByOs(
      amostraExists.numeroOs,
    );
    const progresso = this.calcularMediaProgresso(amostras);
    if (progresso > 0) {
      const status = (progresso == 100 ? 'FINALIZADA' : os.status) as EStatus;
      const ordemFinalizada = await this.ordemServicoRepository.updateStatus(
        os.id,
        status,
        '',
        progresso,
      );
      if (progresso === 100) {
        await this.mailService.sendOrdemConcluidaEmail(ordemFinalizada);
      }
    }

    const amostraCompleta = await this.amostraRepository.assinar(id, userId);
    try {
      await this.notificationsService.createForUser(
        amostraCompleta.userId,
        '✅ Ensaio Finalizado',
        `Os resultados da amostra ${amostraCompleta.nomeAmostra.toUpperCase()} e estão prontos para visualização.`,
      );
    } catch (error) {
      console.log(error);
    }
    return amostraCompleta;
  }

  async findAllWithUsers(query: AmostraQueryDto, user: User) {
    if (!user) {
      throw new HttpException('Erro ao obter Usuário!', HttpStatus.NOT_FOUND);
    }
    return this.amostraRepository.findAllWithUsers(query, user.id);
  }

  async findAllWithUsersAdmin(query: AmostraQueryDto) {
    return this.amostraRepository.findAllWithUsers(query);
  }
  async findAllWithUsersByOs(numeroOs: string,user:User) {
    if(user.role == 'USUARIO'){
      const ordem = await this.ordemServicoRepository.findById(numeroOs);
      if(ordem?.solicitanteId !== user.id){
        throw new HttpException('Você não tem permissão para acesso ao conteúdo.', HttpStatus.FORBIDDEN)
      }
    }
    return this.amostraRepository.findAllWithUsersByOs(numeroOs);
  }

  async delete(id: number) {
    return id;
  }

  calculaProgresso(amostra: UpdateAmostraDto): number {
    const numEnsaios = amostra.ensaiosSolicitados.length;
    const numResultados = Object.keys(
      amostra.resultados as Record<string, object>,
    ).length;
    return (numResultados * 100) / numEnsaios;
  }

  calcularMediaProgresso(amostras: IAmostra[]): number {
    if (!amostras || amostras.length === 0) {
      return 0;
    }
    const somaTotal = amostras.reduce((acumulador, amostraAtual) => {
      return acumulador + amostraAtual.progresso!;
    }, 0);
    const media = somaTotal / amostras.length;
    return media;
  }
}
