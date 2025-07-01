import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParametrosAnaliseController } from './parametro-analise.controller';
import { ParametrosAnaliseService } from './parametro-analise.service';
import { ParametrosAnaliseRepository } from './repositories/parametro-analise.repository';
import { TipoAnaliseModule } from '../tipo-de-analise/tipo-analise.module';

@Module({
  imports: [PrismaModule, TipoAnaliseModule],
  controllers: [ParametrosAnaliseController],
  providers: [ParametrosAnaliseService, ParametrosAnaliseRepository],
})
export class ParametrosAnaliseModule {}
