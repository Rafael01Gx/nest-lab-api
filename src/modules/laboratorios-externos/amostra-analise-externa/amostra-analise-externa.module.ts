import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AmostraAnaliseExternaRepository } from './repositories/amostra-analise-externa.repository';
import { AmostraAnaliseExternaController } from './amostra-analise-externa.controller';
import { AmostraAnaliseExternaService } from './amostra-analise-externa.service';

@Module({
  providers: [AmostraAnaliseExternaService, AmostraAnaliseExternaRepository],
  controllers: [AmostraAnaliseExternaController],
  imports: [PrismaModule],
  exports: [AmostraAnaliseExternaRepository],
})
export class AmostraAnaliseExternaModule {}
