import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LaboratorioRepository } from './repositories/laboratorio.repository';
import { LaboratorioController } from './laboratorio.controller';
import { LaboratorioService } from './laboratorio.service';

@Module({
  providers: [LaboratorioService, LaboratorioRepository],
  controllers: [LaboratorioController],
  imports: [PrismaModule],
  exports: [LaboratorioRepository],
})
export class LaboratorioModule {}
