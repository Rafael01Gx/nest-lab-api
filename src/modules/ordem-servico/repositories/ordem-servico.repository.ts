import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IOrdemServico } from '../interfaces/ordem-servico.interface';
import { EStatus } from '@prisma/client';
import { OrdemServicoQueryDto } from '../dto/ordem-servico-query.dto';
import { OrdemServicoAgendamentoDto } from '../dto/ordem-servico-agendamento.dto';

@Injectable()
export class OrdemServicoRepository {
  constructor(private readonly prisma: PrismaService) { }
  #returnOptions = {
    include: {
      amostras: {
        include: {
          ensaiosSolicitados: {
            omit: {
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
      solicitante: {
        omit: {
          password: true,
          role: true,
          passwordResetExpires: true,
          passwordResetToken: true,
          authorization: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  };

  async create(_data: IOrdemServico): Promise<IOrdemServico> {
    const { amostras, ...ordemServico } = _data;
    return this.prisma.ordemServico.create({
      data: {
        id: ordemServico.id,
        solicitanteId: ordemServico.solicitanteId,
        observacao: ordemServico.observacao ? ordemServico.observacao : '',
        amostras: {
          create: amostras.map((amostra) => ({
            nomeAmostra: amostra.nomeAmostra,
            dataAmostra: amostra.dataAmostra,
            userId: amostra.userId,
            ensaiosSolicitados: {
              connect: amostra.ensaiosSolicitados.map((id) => ({
                id: Number(id),
              })),
            },
          })),
        },
      },
      ...this.#returnOptions,
    });
  }

  async findAll(query: OrdemServicoQueryDto): Promise<IOrdemServico[]> {
    const { status, prazoInicioFim } = query;
    const statusFilter = status
      ? Array.isArray(status)
        ? { in: status }
        : { equals: status }
      : undefined;
    const prazo = prazoInicioFim ? { not: '' } : undefined;
    return this.prisma.ordemServico.findMany({
      where: {
        status: statusFilter,
        prazoInicioFim: prazo,
      },
      ...this.#returnOptions,
    });
  }

  async findByFilters(query: OrdemServicoQueryDto): Promise<any> {
    const { page = 1, limit = 10, status, dataInicio, dataFim, concluidas, progresso, solicitante } = query;
    const skip = (page - 1) * limit;
    const solicitanteResult = solicitante
      ? await this.prisma.user.findFirst({
        where: { name: solicitante },
        select: { id: true }
      })
      : null;
    const solicitanteId = solicitanteResult ? solicitanteResult.id : null;
    const createdAtFilter = {
      ...(dataInicio && { gte: new Date(dataInicio) }),
      ...(dataFim && { lte: new Date(dataFim) }),
    };
    const where: any = {
      ...(solicitanteId && { solicitanteId }),
      ...(status && { status }),
      ...(dataInicio &&
        dataFim && {
        createdAt: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      }),
      ...(progresso && { progresso }),
      ...(concluidas && {
        progresso: 100, revisor: {
          not: ""
        }
      }),
      ...(Object.keys(createdAtFilter).length > 0 && {
        createdAt: createdAtFilter
      }),
    };

      const [ordens, total] = await this.prisma.$transaction([
      this.prisma.ordemServico.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'desc' },
      ...this.#returnOptions,
    }),
      this.prisma.ordemServico.count({
        where,
      }),
    ]);

    if (!ordens.length) {
      return {
        data: [],
        meta: { total: 0, totalPages: 0, currentPage: page, perPage: limit },
      };
    }
return {
      data:ordens,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };

  }

  async findAllByUser(
    id: string,
    query: OrdemServicoQueryDto,
  ): Promise<IOrdemServico[]> {
    const { status } = query;
    const statusFilter = status
      ? Array.isArray(status)
        ? { in: status }
        : { equals: status }
      : undefined;
    return this.prisma.ordemServico.findMany({
      where: {
        solicitanteId: id,
        status: statusFilter,
      },
      orderBy: { createdAt: 'desc' },
      ...this.#returnOptions,
    });
  }

  async findById(id: string): Promise<IOrdemServico | null> {
    return this.prisma.ordemServico.findUnique({
      where: { id },
      ...this.#returnOptions,
    });
  }

  async updateStatus(
    id: string,
    status: EStatus,
    observacao?: string,
    progresso?: number,
  ): Promise<IOrdemServico> {
    const data = {
      ...(status && { status }),
      ...(observacao && { observacao }),
      ...(progresso && { progresso }),
    }
    return this.prisma.ordemServico.update({
      where: { id },
      data,
      ...this.#returnOptions,
    });
  }

  async updateRecepcaoAgendamento(
    data: OrdemServicoAgendamentoDto,
  ): Promise<IOrdemServico> {
    const { id, dataRecepcao, prazoInicioFim, observacao } = data;
    return this.prisma.ordemServico.update({
      where: { id },
      data: {
        dataRecepcao,
        prazoInicioFim,
        observacao,
      },
      ...this.#returnOptions,
    });
  }

  async countAll(): Promise<number> {
    return this.prisma.ordemServico.count();
  }

  async countByStatus(): Promise<{ status: EStatus; count: number }[]> {
    const result = await this.prisma.ordemServico.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });
    return result.map((item) => ({
      status: item.status,
      count: Number(item._count.status),
    }));
  }

  async countByMonth(): Promise<{ month: string; count: number }[]> {
    const result = await this.prisma.$queryRaw<
      { month: string; count: number }[]
    >`
    SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS count
    FROM OrdemServico
    GROUP BY month
    ORDER BY month;
  `;
    return result.map((item): { month: string; count: number } => ({
      month: item.month,
      count: Number(item.count),
    }));
  }

}
