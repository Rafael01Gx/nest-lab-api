import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AmostraAnaliseExternaRepository } from './repositories/amostra-analise-externa.repository';
import { AmostraAnaliseExternaController } from './amostra-analise-externa.controller';
import { AmostraAnaliseExternaService } from './amostra-analise-externa.service';
import { AnaliseAlcalisZincoRepository } from './repositories/analise-alcalis-zinco.repository';

@Module({
  providers: [AmostraAnaliseExternaService, AmostraAnaliseExternaRepository, AnaliseAlcalisZincoRepository],
  controllers: [AmostraAnaliseExternaController],
  imports: [PrismaModule],
  exports: [AmostraAnaliseExternaRepository],
})
export class AmostraAnaliseExternaModule {}
