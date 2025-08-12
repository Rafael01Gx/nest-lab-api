import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IOrdemServico } from '../interfaces/ordem-servico.interface';

@Injectable()
export class OrdemServicoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(_data: IOrdemServico): Promise<IOrdemServico | any> {
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
      include: {
        amostras: {
          include: {
            ensaiosSolicitados: true,
          },
        },
        solicitante: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      omit: { createdAt: true, updatedAt: true },
    });
  }
  /*
  
  async findAll(): Promise<IOrdemServico[] | any> {
    return this.prisma.configuracaoAnalise.findMany({
      include: {
        tipoAnalise: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        parametros: {
          include: {
            tipoAnalise: {
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
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(
    id: number,
    _data: UpdateOrdemServicoDto,
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  ): Promise<IOrdemServico | any> {
    const { parametros, ...configAnalise } = _data;
    return this.prisma.configuracaoAnalise.update({
      where: { id },
      data: {
        nomeDescricao: configAnalise.nomeDescricao,
        tipoAnaliseId: configAnalise.tipoAnaliseId,
        parametros: {
          connect: parametros.map((id) => ({ id })),
        },
      },
      include: {
        tipoAnalise: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        parametros: {
          include: {
            tipoAnalise: {
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
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.configuracaoAnalise.delete({
      where: { id },
    });
    return;
  }

 
  async findById(id: number): Promise<IOrdemServico | any> {
    return this.prisma.configuracaoAnalise.findUnique({
      where: { id },
      include: {
        tipoAnalise: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        parametros: {
          include: {
            tipoAnalise: {
              omit: {
                createdAt: true,
                updatedAt: true,
              },
            },
          },
          omit: {
            tipoAnaliseId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  */
}
