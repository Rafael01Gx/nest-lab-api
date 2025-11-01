import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAmostraAnaliseExternaDto } from '../dto/update-amostra-analise-externa.dto';
import {
  EstatisticasGerais,
  FiltrosAnalytics,
  IAmostraAnaliseExterna,
} from '../interfaces/amostra-analise-externa.interface';
import { AmostraAnaliseExternaQueryDto } from '../dto/amostra-analise-externa-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AmostraAnaliseExternaRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: AmostraAnaliseExternaQueryDto): Promise<any> {
    const {
      amostraName,
      labExternoId,
      dataFim,
      dataInicio,
      page = 1,
      limit = 10,
      analiseConcluida,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(amostraName && { amostraName }),
      ...(labExternoId && { remessaLabExternoId: labExternoId }),
      ...(dataInicio &&
        dataFim && {
        createdAt: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      }),
      ...(analiseConcluida && { analiseConcluida }),
    };

    const [amostras, total] = await this.prisma.$transaction([
      this.prisma.amostraAnaliseExterna.findMany({
        where,
        include: {
          RemessaLabExterno: {
            select: {
              data: true,
              destino: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.amostraAnaliseExterna.count({
        where,
      }),
    ]);

    return {
      data: amostras,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async update(id: number, dto: UpdateAmostraAnaliseExternaDto): Promise<IAmostraAnaliseExterna> {
    return await this.prisma.amostraAnaliseExterna.update({
      where: { id },
      data: {
        analiseConcluida: dto.analiseConcluida,
        elementosAnalisados: dto.elementosAnalisados,
      },
      include: { analiseAlcalisZinco: true },
    });
  }

  async findAllWithResults(query: AmostraAnaliseExternaQueryDto): Promise<any> {
    const {
      amostraName,
      labExternoId,
      dataFim,
      dataInicio,
      page = 1,
      limit = 100,
      analiseConcluida = true,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(amostraName && {
        amostraName: {
          contains: amostraName
        }
      }),
      ...(labExternoId && { remessaLabExternoId: labExternoId }),
      ...(dataInicio &&
        dataFim && {
        createdAt: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      }),
      ...(analiseConcluida && { analiseConcluida }),
    };

    const [amostras, total] = await this.prisma.$transaction([
      this.prisma.amostraAnaliseExterna.findMany({
        where,
        include: {
          RemessaLabExterno: {
            select: {
              data: true,
              destino: {
                select: {
                  id: true,
                  nome: true,
                }
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.amostraAnaliseExterna.count({
        where,
      }),
    ]);

    const todosElementos = amostras.flatMap((amostra: any) =>
      amostra.elementosAnalisados.map(e => e.elemento)
    );
    const elements = Array.from(new Set(todosElementos));


    return {
      data: amostras,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
        elements,
      },
    };
  }

  async findFirstQuery(query: AmostraAnaliseExternaQueryDto): Promise<any> {
    const { amostraName, dataInicio, dataFim } = query;
    const nomeCompleto = amostraName?.trim();

    const result = await this.prisma.$queryRaw<any[]>`SELECT *
      FROM AmostraAnaliseExterna
      WHERE dataInicio >= ${dataInicio}
        AND dataFim <= ${dataFim}
        AND TRIM(CONCAT(amostraName, ' ', subIdentificacao)) = ${nomeCompleto} LIMIT 1;`;

    return result.length ? result[0] : null;
  }

  async findById(id: number): Promise<IAmostraAnaliseExterna | null> {
    return this.prisma.amostraAnaliseExterna.findFirst({
      where: { id },
      include: {
        RemessaLabExterno: {
          select: {
            data: true,
            destino: true,
          },
        },
      },
    });
  }

  async findAllForAnalytics(filtros?: FiltrosAnalytics): Promise<any> {
    const where: any = {};

    if (filtros?.analiseConcluida !== undefined) {
      where.analiseConcluida = filtros.analiseConcluida;
    }

    if (filtros?.laboratorioId) {
      where.RemessaLabExterno = {
        destinoId: filtros.laboratorioId,
      };
    }

    if (filtros?.dataInicio || filtros?.dataFim) {
      where.RemessaLabExterno = {
        ...where.RemessaLabExterno,
        data: {
          ...(filtros.dataInicio && { gte: new Date(filtros.dataInicio) }),
          ...(filtros.dataFim && { lte: new Date(filtros.dataFim) }),
        },
      };
    }

    const amostras = this.prisma.amostraAnaliseExterna.findMany({
      where,
      select: {
        id: true,
        amostraName: true,
        subIdentificacao: true,
        dataInicio: true,
        dataFim: true,
        elementosSolicitados: true,
        elementosAnalisados: true,
        analiseConcluida: true,
        createdAt: true,
        updatedAt: true,
        remessaLabExternoId: true,
        RemessaLabExterno: {
          select: {
            data: true,
            destino: {
              select: {
                id: true,
                nome: true,
                endereco: true,
                telefone: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: [{ RemessaLabExterno: { data: 'desc' } }, { createdAt: 'desc' }],
    });
    return amostras;
  }

  async getEstatisticasGerais(
    filtros?: FiltrosAnalytics,
  ): Promise<EstatisticasGerais> {
    const where: any = {};

    // Aplicar os mesmos filtros
    if (filtros?.analiseConcluida !== undefined) {
      where.analiseConcluida = filtros.analiseConcluida;
    }

    if (filtros?.laboratorioId) {
      where.RemessaLabExterno = {
        destinoId: filtros.laboratorioId,
      };
    }

    if (filtros?.dataInicio || filtros?.dataFim) {
      where.RemessaLabExterno = {
        ...where.RemessaLabExterno,
        data: {
          ...(filtros.dataInicio && { gte: new Date(filtros.dataInicio) }),
          ...(filtros.dataFim && { lte: new Date(filtros.dataFim) }),
        },
      };
    }

    const [
      totalAmostras,
      amostrasCompletas,
      laboratorios,
      remessas,
      amostrasParaMedia,
    ] = await Promise.all([
      // Total de amostras
      this.prisma.amostraAnaliseExterna.count({ where }),

      // Amostras completas
      this.prisma.amostraAnaliseExterna.count({
        where: { ...where, analiseConcluida: true },
      }),

      // Total de laboratórios únicos
      this.prisma.amostraAnaliseExterna.findMany({
        where,
        select: {
          RemessaLabExterno: {
            select: {
              destinoId: true,
            },
          },
        },
        distinct: ['remessaLabExternoId'],
      }),

      // Total de remessas únicas
      this.prisma.amostraAnaliseExterna.findMany({
        where,
        select: {
          remessaLabExternoId: true,
        },
        distinct: ['remessaLabExternoId'],
      }),

      // Buscar amostras para calcular média de elementos
      this.prisma.amostraAnaliseExterna.findMany({
        where,
        select: {
          elementosSolicitados: true,
        },
      }),
    ]);

    const amostrasIncompletas = totalAmostras - amostrasCompletas;
    const percentualConclusao =
      totalAmostras > 0
        ? Math.round((amostrasCompletas / totalAmostras) * 100)
        : 0;

    // Calcular média de elementos
    const totalElementos = amostrasParaMedia.reduce((acc, amostra) => {
      const elementos = amostra.elementosSolicitados as any[];
      return acc + (Array.isArray(elementos) ? elementos.length : 0);
    }, 0);

    const mediaElementosPorAmostra =
      totalAmostras > 0
        ? Number((totalElementos / totalAmostras).toFixed(2))
        : 0;

    // Contar laboratórios únicos
    const laboratoriosUnicos = new Set(
      laboratorios.map((a) => a.RemessaLabExterno.destinoId),
    );

    return {
      totalAmostras,
      amostrasCompletas,
      amostrasIncompletas,
      percentualConclusao,
      totalLaboratorios: laboratoriosUnicos.size,
      totalRemessas: remessas.length,
      mediaElementosPorAmostra,
    };
  }

  async getEstatisticasPorLaboratorio(filtros?: FiltrosAnalytics) {
    const where: Prisma.AmostraAnaliseExternaWhereInput = {};

    if (filtros?.dataInicio || filtros?.dataFim) {
      where.RemessaLabExterno = {
        data: {
          ...(filtros.dataInicio && { gte: filtros.dataInicio }),
          ...(filtros.dataFim && { lte: filtros.dataFim }),
        },
      };
    }

    // Buscar todas as amostras agrupadas
    const amostras = await this.prisma.amostraAnaliseExterna.findMany({
      where,
      select: {
        analiseConcluida: true,
        RemessaLabExterno: {
          select: {
            destino: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    // Agrupar por laboratório
    const laboratoriosMap = new Map();

    amostras.forEach((amostra) => {
      const labId = amostra.RemessaLabExterno.destino.id;
      const labNome = amostra.RemessaLabExterno.destino.nome;

      if (!laboratoriosMap.has(labId)) {
        laboratoriosMap.set(labId, {
          laboratorioId: labId,
          laboratorioNome: labNome,
          totalAmostras: 0,
          amostrasCompletas: 0,
          amostrasIncompletas: 0,
          taxaConclusao: 0,
        });
      }

      const lab = laboratoriosMap.get(labId);
      lab.totalAmostras++;

      if (amostra.analiseConcluida) {
        lab.amostrasCompletas++;
      } else {
        lab.amostrasIncompletas++;
      }
    });

    // Calcular taxa de conclusão
    const resultado = Array.from(laboratoriosMap.values()).map((lab) => ({
      ...lab,
      taxaConclusao:
        lab.totalAmostras > 0
          ? Math.round((lab.amostrasCompletas / lab.totalAmostras) * 100)
          : 0,
    }));

    return resultado.sort((a, b) => b.totalAmostras - a.totalAmostras);
  }

  async getEstatisticasPorRemessa(filtros?: FiltrosAnalytics) {
    const where: any = {};

    if (filtros?.laboratorioId) {
      where.RemessaLabExterno = {
        destinoId: filtros.laboratorioId,
      };
    }

    if (filtros?.dataInicio || filtros?.dataFim) {
      where.RemessaLabExterno = {
        ...where.RemessaLabExterno,
        data: {
          ...(filtros.dataInicio && { gte: new Date(filtros.dataInicio) }),
          ...(filtros.dataFim && { lte: new Date(filtros.dataFim) }),
        },
      };
    }

    const amostras = await this.prisma.amostraAnaliseExterna.findMany({
      where,
      select: {
        analiseConcluida: true,
        remessaLabExternoId: true,
        RemessaLabExterno: {
          select: {
            id: true,
            data: true,
            destino: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    // Agrupar por remessa
    const remessasMap = new Map();

    amostras.forEach((amostra) => {
      const remessaId = amostra.remessaLabExternoId;
      const remessaData = amostra.RemessaLabExterno.data;
      const labNome = amostra.RemessaLabExterno.destino.nome;

      if (!remessasMap.has(remessaId)) {
        remessasMap.set(remessaId, {
          remessaId,
          data: remessaData,
          laboratorioNome: labNome,
          totalAmostras: 0,
          amostrasCompletas: 0,
          amostrasIncompletas: 0,
          taxaConclusao: 0,
        });
      }

      const remessa = remessasMap.get(remessaId);
      remessa.totalAmostras++;

      if (amostra.analiseConcluida) {
        remessa.amostrasCompletas++;
      } else {
        remessa.amostrasIncompletas++;
      }
    });

    // Calcular taxa de conclusão
    const resultado = Array.from(remessasMap.values()).map((remessa) => ({
      ...remessa,
      taxaConclusao:
        remessa.totalAmostras > 0
          ? Math.round(
            (remessa.amostrasCompletas / remessa.totalAmostras) * 100,
          )
          : 0,
    }));

    return resultado.sort((a, b) => {
      const dateA = new Date(a.data).getTime();
      const dateB = new Date(b.data).getTime();
      return dateB - dateA;
    });
  }

  async getEstatisticasElementos(filtros?: FiltrosAnalytics) {
    const where: any = {};

    if (filtros?.laboratorioId) {
      where.RemessaLabExterno = {
        destinoId: filtros.laboratorioId,
      };
    }

    if (filtros?.dataInicio || filtros?.dataFim) {
      const dataFilter: Prisma.DateTimeFilter = {};

      if (filtros.dataInicio) {
        dataFilter.gte = new Date(filtros.dataInicio);
      }

      if (filtros.dataFim) {
        dataFilter.lte = new Date(filtros.dataFim);
      }

      where.RemessaLabExterno = {
        ...where.RemessaLabExterno,
        data: dataFilter,
      };
    }
    const amostras = await this.prisma.amostraAnaliseExterna.findMany({
      where,
      select: {
        elementosSolicitados: true,
        elementosAnalisados: true,
        analiseConcluida: true,
      },
    });

    const elementosMap = new Map();

    amostras.forEach((amostra) => {
      const solicitados = amostra.elementosSolicitados as any[];
      const analisados = amostra.elementosAnalisados as any[];

      if (Array.isArray(solicitados)) {
        solicitados.forEach((elemento) => {
          if (!elementosMap.has(elemento)) {
            elementosMap.set(elemento, {
              elemento,
              solicitacoes: 0,
              analisados: 0,
              pendentes: 0,
              taxaConclusao: 0,
            });
          }

          const elem = elementosMap.get(elemento);
          elem.solicitacoes++;

          // Verificar se foi analisado
          if (amostra.analiseConcluida && Array.isArray(analisados)) {
            const encontrado = analisados.find((a) => a.elemento === elemento);
            if (
              encontrado &&
              encontrado.valor &&
              encontrado.valor.trim() !== ''
            ) {
              elem.analisados++;
            } else {
              elem.pendentes++;
            }
          } else {
            elem.pendentes++;
          }
        });
      }
    });

    const resultado = Array.from(elementosMap.values()).map((elem) => ({
      ...elem,
      taxaConclusao:
        elem.solicitacoes > 0
          ? Math.round((elem.analisados / elem.solicitacoes) * 100)
          : 0,
    }));

    return resultado.sort((a, b) => b.solicitacoes - a.solicitacoes);
  }

  async getDashboardCompleto(filtros?: FiltrosAnalytics) {
    const calcularDataInicioPadrao = (): Date => {
      const hoje = new Date();
      hoje.setFullYear(hoje.getFullYear() - 1);
      return hoje;
    };
    const filtrosReais = filtros || {};
    const dataInicioPadrao = calcularDataInicioPadrao();

    const {
      laboratorioId,
      dataInicio = dataInicioPadrao,
      dataFim,
      analiseConcluida,
    } = filtrosReais;

    const filtrosComPadrao: FiltrosAnalytics = {
      laboratorioId,
      dataInicio,
      dataFim,
      analiseConcluida,
    };

    const [
      amostras,
      estatisticasGerais,
      estatisticasLaboratorio,
      estatisticasRemessa,
    ] = await Promise.all([
      this.findAllForAnalytics(filtrosComPadrao),
      this.getEstatisticasGerais(filtrosComPadrao),
      this.getEstatisticasPorLaboratorio(filtrosComPadrao),
      this.getEstatisticasPorRemessa(filtrosComPadrao),
    ]);

    return {
      amostras,
      estatisticas: {
        geral: estatisticasGerais,
        porLaboratorio: estatisticasLaboratorio,
        porRemessa: estatisticasRemessa,
      },
    };
  }


}
// async update(id: number, dto: UpdateAmostraAnaliseExternaDto): Promise<any> {
//   return this.prisma.amostraAnaliseExterna.update({
//     where: { id },
//     data: {
//       analiseConcluida: dto.analiseConcluida,
//       elementosAnalisados: dto.elementosAnalisados,
//     },
//   });
// }

// `SELECT *
//    FROM AmostraAnaliseExterna
//    WHERE
//      dataInicio >= ${dataInicio}
//      AND dataFim <= ${dataFim}
//      AND REPLACE(REPLACE(TRIM(CONCAT(amostraName, ' ', subIdentificacao)), '.', ''), '-', '')
//          = REPLACE(REPLACE(${nomeCompleto}, '.', ''), '-', '')
//    LIMIT 1;`;
