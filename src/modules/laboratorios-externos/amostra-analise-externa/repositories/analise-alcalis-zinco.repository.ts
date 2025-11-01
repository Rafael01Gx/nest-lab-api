import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAmostraAnaliseExternaDto } from '../dto/update-amostra-analise-externa.dto';
import {
    ElementoResultado,
    IAmostraAnaliseExterna,
} from '../interfaces/amostra-analise-externa.interface';
import { AmostraAnaliseExternaQueryDto } from '../dto/amostra-analise-externa-query.dto';

@Injectable()
export class AnaliseAlcalisZincoRepository {
    constructor(private readonly prisma: PrismaService) { }

    async upsert(amostra: IAmostraAnaliseExterna, elementos: any): Promise<any> {
        await this.prisma.analiseAlcalisZinco.upsert({
            where: { amostraAnaliseExternaId: amostra.id },
            create: {
                amostraAnaliseExternaId: amostra.id,
                amostraName: amostra.amostraName + " " + amostra.subIdentificacao,
                dataInicio: new Date(amostra.dataInicio + 'T03:00:00.000Z'),
                dataFim: new Date(amostra.dataFim + 'T03:00:00.000Z'),
                K2O: elementos.K2O ?? null,
                Na2O: elementos.Na2O ?? null,
                Zn: elementos.Zn ?? null,
            },
            update: {
                amostraName: amostra.amostraName,
                dataInicio: new Date(amostra.dataInicio + 'T03:00:00.000Z'),
                dataFim: new Date(amostra.dataFim + 'T03:00:00.000Z'),
                K2O: elementos.K2O ?? null,
                Na2O: elementos.Na2O ?? null,
                Zn: elementos.Zn ?? null,
            },
        });
    }

    async findAll(query: AmostraAnaliseExternaQueryDto): Promise<any> {
        const {
            amostraName,
            dataFim,
            dataInicio,
            page = 1,
            limit = 20,
        } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            ...(amostraName && { amostraName }),
            ...(dataInicio && {
                dataInicio: {
                    gte: new Date(dataInicio),
                },
            }),
            ...(dataFim && {
                dataFim: {
                    lte: new Date(dataFim),
                },
            }),
        };

        const [amostras, total] = await this.prisma.$transaction([
            this.prisma.analiseAlcalisZinco.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'desc' },
            }),
            this.prisma.analiseAlcalisZinco.count({
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

    async deleteMany(id: number): Promise<any> {
        await this.prisma.analiseAlcalisZinco.deleteMany({
            where: { amostraAnaliseExternaId: id },
        });
    }


}