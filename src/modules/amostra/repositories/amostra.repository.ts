import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAmostraDto } from '../dto/create-amostra.dto';
import { IAmostra } from '../interfaces/amostra.interface';
import { EStatus } from '@prisma/client';
import { UpdateAmostraDto } from '../dto/update-amostra.dto';
import { AmostraQueryDto } from '../dto/amostra-servico-query.dto';

@Injectable()
export class AmostraRepository {
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

  async findAllWithUsers(query: AmostraQueryDto, userId: string) {
    const { page = 1, limit = 10, status, dataInicio, dataFim } = query;
    const skip = (page - 1) * limit;
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
      ...(dataInicio &&
        !dataFim && {
          createdAt: {
            gte: new Date(dataInicio),
          },
        }),
      ...(dataFim &&
        !dataInicio && {
          createdAt: {
            lte: new Date(dataFim),
          },
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
}
