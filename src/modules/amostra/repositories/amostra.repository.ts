import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { AgendamentoSemanal, IAmostra } from '../interfaces/amostra.interface';
import { EStatus } from '@prisma/client';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';
import { AmostraQueryDto } from '../dto/amostra-servico-query.dto';
import { startOfWeek, parseISO, format, getWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AgendaQueryDto } from '../dto/agenda-query.dto';
import { AgendamentoSemanalDto, AmostraDetalhesDto, EstatisticasDto, TipoAnaliseDto } from '../dto/agenda-response.dto';

@Injectable()
export class AmostraRepository {
  private readonly logger = new Logger(AmostraRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  #userSelectSafe = {
    omit: {
      password: true,
      role: true,
      passwordResetExpires: true,
      passwordResetToken: true,
      authorization: true,
      createdAt: true,
      updatedAt: true,
    },
  };

  #returnOptions = {
    include: {
      ensaiosSolicitados: true,
      user: this.#userSelectSafe,
    },
    omit: { createdAt: true },
  };

  async create(_data: CreateAmostraDto): Promise<any> {
    const { ensaiosSolicitados, ...amostra } = _data;
    return this.prisma.amostra.create({
      data: {
        ensaiosSolicitados: {
          connect: ensaiosSolicitados.map((id) => ({ id })),
        },
        ...amostra,
      },
      ...this.#returnOptions,
    });
  }

  async findAll(query: AmostraQueryDto): Promise<IAmostra[]> {
    const { status, prazoInicioFim } = query;
    const statusFilter = status
      ? Array.isArray(status)
        ? { in: status }
        : { equals: status }
      : undefined;
    const prazo = prazoInicioFim?.includes('TRUE') ? { not: '' } : undefined;
    return this.prisma.amostra.findMany({
      where: { status: statusFilter, prazoInicioFim: prazo },
      ...this.#returnOptions,
    });
  }

  async findAllByUser(userId: string): Promise<IAmostra[]> {
    return this.prisma.amostra.findMany({
      where: { userId },
      ...this.#returnOptions,
    });
  }

  async findById(id: number): Promise<IAmostra | null> {
    return this.prisma.amostra.findUnique({
      where: { id },
      ...this.#returnOptions,
    });
  }

    async findByOs(numeroOs: string): Promise<IAmostra[]> {
    return this.prisma.amostra.findMany({
      where: { numeroOs },
      ...this.#returnOptions,
    });
  }

  async updateStatusByOs(numeroOs: string, status: EStatus): Promise<any> {
    return this.prisma.amostra.updateMany({
      where: { numeroOs },
      data: { status },
    });
  }

  async updateRecepcaoAgendamento(
    data: Partial<UpdateAmostraDto>,
  ): Promise<IAmostra> {
    const { prazoInicioFim, dataRecepcao, status } = data;
    return this.prisma.amostra.update({
      where: { id: data.id },
      data: {
        prazoInicioFim,
        dataRecepcao,
        status,
      },
      ...this.#returnOptions,
    });
  }

  async update(id: number, dto: UpdateAmostraDto): Promise<IAmostra> {
    const allowedFields: (keyof UpdateAmostraDto)[] = [
      'analistas',
      'progresso',
      'resultados',
      'status',
    ];
    const dataToUpdate = Object.fromEntries(
      Object.entries(dto).filter(
        ([key, value]) =>
          allowedFields.includes(key as keyof UpdateAmostraDto) &&
          value !== undefined,
      ),
    );

    return this.prisma.amostra.update({
      where: { id },
      data: dataToUpdate,
      ...this.#returnOptions,
    });
  }

  async assinar(id: number, revisor: string): Promise<IAmostra> {
    return this.prisma.amostra.update({
      where: { id },
      data: {revisor,
        status: 'FINALIZADA',
      },
      ...this.#returnOptions,
    });
  }

  async findAllWithUsers(query: AmostraQueryDto, userId: string) {
    const { page = 1, limit = 10, status, dataInicio, dataFim ,concluidas,progresso } = query;
    const skip = (page - 1) * limit;
    const createdAtFilter = {
    ...(dataInicio && { gte: new Date(dataInicio) }), 
    ...(dataFim && { lte: new Date(dataFim) }),
};
    const where: any = {
      userId,
      ...(status && { status }),
      ...(dataInicio &&
        dataFim && {
          createdAt: {
            gte: new Date(dataInicio),
            lte: new Date(dataFim),
          },
        }), 
        ...(progresso && {progresso}),
      ...(concluidas &&  { progresso: 100 , revisor:{
        not: ""
      }}),
     ...(Object.keys(createdAtFilter).length > 0 && {
        createdAt: createdAtFilter
    }),
    };

    const [amostras, total] = await this.prisma.$transaction([
      this.prisma.amostra.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: { ensaiosSolicitados: true, user: this.#userSelectSafe },
      }),
      this.prisma.amostra.count({
        where,
      }),
    ]);

    if (!amostras.length) {
      return {
        data: [],
        meta: { total: 0, totalPages: 0, currentPage: page, perPage: limit },
      };
    }

    const revisorIds = amostras
      .map((a) => a.revisor)
      .filter((id): id is string => !!id);

    const analistasIds = amostras
      .flatMap((a) => (Array.isArray(a.analistas) ? a.analistas : []))
      .filter((id): id is string => !!id);

    const allUserIds = Array.from(new Set([...revisorIds, ...analistasIds]));

    const users = await this.prisma.user.findMany({
      where: { id: { in: allUserIds } },
      ...this.#userSelectSafe,
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enriched = amostras.map((a) => ({
      ...a,
      revisor: a.revisor ? (userMap.get(a.revisor) ?? null) : null,
      analistas: Array.isArray(a.analistas)
        ? a.analistas
            .map((id) => userMap.get(id as string) ?? null)
            .filter(Boolean)
        : [],
    }));
    return {
      data: enriched,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async findAllWithUsersByUsers(query: AmostraQueryDto, userId: string) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [amostras, total] = await this.prisma.$transaction([
      this.prisma.amostra.findMany({
        where: { userId, status: EStatus.FINALIZADA },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: { ensaiosSolicitados: true, user: this.#userSelectSafe },
      }),
      this.prisma.amostra.count({
        where: { status: EStatus.FINALIZADA },
      }),
    ]);

    if (!amostras.length) {
      return {
        data: [],
        meta: { total: 0, totalPages: 0, currentPage: page, perPage: limit },
      };
    }

    const revisorIds = amostras
      .map((a) => a.revisor)
      .filter((id): id is string => !!id);

    const analistasIds = amostras
      .flatMap((a) => (Array.isArray(a.analistas) ? a.analistas : []))
      .filter((id): id is string => !!id);

    const allUserIds = Array.from(new Set([...revisorIds, ...analistasIds]));

    const users = await this.prisma.user.findMany({
      where: { id: { in: allUserIds } },
      ...this.#userSelectSafe,
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enriched = amostras.map((a) => ({
      ...a,
      revisor: a.revisor ? (userMap.get(a.revisor) ?? null) : null,
      analistas: Array.isArray(a.analistas)
        ? a.analistas
            .map((id) => userMap.get(id as string) ?? null)
            .filter(Boolean)
        : [],
    }));
    return {
      data: enriched,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }

 async getAgendamentoSemanal(
    query?: AgendaQueryDto
  ): Promise<AgendamentoSemanalDto[]> {
    try {
      this.logger.log('Buscando agendamentos semanais...');

      // Construir where clause dinamicamente
      const whereClause: any = {
        status: {
          in: query?.status || ['EXECUCAO', 'AUTORIZADA'],
        },
        prazoInicioFim: {
          not: '',
        },
      };
      if (query?.dataInicio || query?.dataFim) {
        // Implementar lógica...
      }

      const amostras = await this.prisma.amostra.findMany({
        where: whereClause,
        include: {
          ensaiosSolicitados: true,
          ordemServico: {
            select: {
              id: true,
              solicitante: true,
            },
          },
        },
        orderBy: {
          prazoInicioFim: 'asc',
        },
      });

      this.logger.log(`${amostras.length} amostras encontradas`);

      const agrupamento = new Map<
        string,
        Map<string, TipoAnaliseDto & { amostras: AmostraDetalhesDto[] }>
      >();

      amostras.forEach((amostra) => {
        const [dataInicial] = amostra.prazoInicioFim.split(' - ');
        const dataInicio = parseISO(dataInicial.trim());

        const inicioSemana = startOfWeek(dataInicio, {
          weekStartsOn: 1,
          locale: ptBR,
        });

        const chaveSemanaMes = format(inicioSemana, 'yyyy-MM-dd');

        if (!agrupamento.has(chaveSemanaMes)) {
          agrupamento.set(chaveSemanaMes, new Map());
        }

        const semanaMap = agrupamento.get(chaveSemanaMes)!;

        let ensaiosFiltrados = amostra.ensaiosSolicitados;
        if (query?.tipo) {
          ensaiosFiltrados = ensaiosFiltrados.filter((e) =>
            e.tipo.toLowerCase().includes(query.tipo!.toLowerCase())
          );
        }
        if (query?.classe) {
          ensaiosFiltrados = ensaiosFiltrados.filter((e) =>
            e.classe.toLowerCase().includes(query.classe!.toLowerCase())
          );
        }

        ensaiosFiltrados.forEach((ensaio) => {
          const chaveTipo = `${ensaio.tipo}|${ensaio.classe}`;

          if (!semanaMap.has(chaveTipo)) {
            semanaMap.set(chaveTipo, {
              tipo: ensaio.tipo,
              classe: ensaio.classe,
              quantidade: 0,
              amostras: [],
            });
          }

          const tipoData = semanaMap.get(chaveTipo)!;
          tipoData.quantidade += 1;

          tipoData.amostras.push({
            id: amostra.id,
            nomeAmostra: amostra.nomeAmostra,
            numeroOs: amostra.numeroOs,
            prazoInicioFim: amostra.prazoInicioFim,
            status: amostra.status,
            dataRecepcao: amostra.dataRecepcao,
            progresso: amostra.progresso,
          });
        });
      });
      const resultado: AgendamentoSemanalDto[] = [];
      Array.from(agrupamento.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([chaveSemanaMes, tiposMap]) => {
          const dataInicio = parseISO(chaveSemanaMes);
          const dataFim = new Date(dataInicio);
          dataFim.setDate(dataFim.getDate() + 6);

          const tiposAnalise = Array.from(tiposMap.values()).sort(
            (a, b) => b.quantidade - a.quantidade
          );

          const totalAmostras = tiposAnalise.reduce(
            (acc, tipo) => acc + tipo.amostras.length,
            0
          );

          const numeroSemana = getWeek(dataInicio, {
            weekStartsOn: 1,
            locale: ptBR,
          });

          resultado.push({
            semana: format(dataInicio, "'Semana de' dd/MM", { locale: ptBR }),
            dataInicio: format(dataInicio, 'yyyy-MM-dd'),
            dataFim: format(dataFim, 'yyyy-MM-dd'),
            tiposAnalise,
            totalAmostras,
            numeroSemana,
          });
        });

      this.logger.log(`${resultado.length} semanas processadas`);
      return resultado;
    } catch (error) {
      this.logger.error('Erro ao buscar agendamentos', error);
      throw error;
    }
  }

  async getEstatisticas(): Promise<EstatisticasDto> {
    const agendamentos = await this.getAgendamentoSemanal();

    const totalAmostras = agendamentos.reduce(
      (acc, sem) => acc + sem.totalAmostras,
      0
    );

    const tiposSet = new Set<string>();
    const distribuicaoPorStatus = { execucao: 0, autorizada: 0 };
    const distribuicaoPorClasse: Record<string, number> = {};

    agendamentos.forEach((sem) => {
      sem.tiposAnalise.forEach((tipo) => {
        tiposSet.add(tipo.tipo);

        distribuicaoPorClasse[tipo.classe] =
          (distribuicaoPorClasse[tipo.classe] || 0) + tipo.quantidade;

        tipo.amostras.forEach((amostra) => {
          if (amostra.status === 'EXECUCAO') distribuicaoPorStatus.execucao++;
          if (amostra.status === 'AUTORIZADA')
            distribuicaoPorStatus.autorizada++;
        });
      });
    });

    return {
      totalAmostras,
      totalSemanas: agendamentos.length,
      tiposUnicos: tiposSet.size,
      distribuicaoPorStatus,
      distribuicaoPorClasse,
    };
  }

  async getAmostraDetalhes(id: number) {
    return this.prisma.amostra.findUnique({
      where: { id },
      include: {
        ensaiosSolicitados: true,
        ordemServico: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
