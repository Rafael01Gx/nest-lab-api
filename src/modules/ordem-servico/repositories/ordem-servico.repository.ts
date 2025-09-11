import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IOrdemServico } from '../interfaces/ordem-servico.interface';
import { EStatus } from '@prisma/client';

@Injectable()
export class OrdemServicoRepository {
  constructor(private readonly prisma: PrismaService) {}
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

  async findAll(): Promise<IOrdemServico[]> {
    return this.prisma.ordemServico.findMany({
      ...this.#returnOptions,
    });
  }

  async findAllByUser(id: string): Promise<IOrdemServico[]> {
    return this.prisma.ordemServico.findMany({
      where: {
        solicitanteId: id,
      },
      ...this.#returnOptions,
    });
  }

  async findById(id: string): Promise<IOrdemServico | null> {
    return this.prisma.ordemServico.findUnique({
      where: { id },
      ...this.#returnOptions,
    });
  }

  async updateStatus(id: string, status: EStatus): Promise<IOrdemServico> {
    return this.prisma.ordemServico.update({
      where: { id },
      data: { status },
      ...this.#returnOptions,
    });
  }

  /*
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
