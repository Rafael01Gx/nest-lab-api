import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAmostraAnaliseExternaDto } from '../dto/update-amostra-analise-externa.dto';
import {
    ElementoResultado,
    IAmostraAnaliseExterna,
} from '../interfaces/amostra-analise-externa.interface';

@Injectable()
export class AnaliseAlcalisZincoRepository {
    constructor(private readonly prisma: PrismaService) { }

    async upsert(amostra: IAmostraAnaliseExterna, elementos: any) {
        await this.prisma.analiseAlcalisZinco.upsert({
            where: { amostraAnaliseExternaId: amostra.id },
            create: {
                amostraAnaliseExternaId: amostra.id,
                amostraName: amostra.amostraName,
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

    async deleteMany(id: number) {
        await this.prisma.analiseAlcalisZinco.deleteMany({
            where: { amostraAnaliseExternaId: id },
        });
    }


}