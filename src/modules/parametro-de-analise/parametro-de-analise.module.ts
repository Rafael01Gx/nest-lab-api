import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ParametrosAnaliseController } from './parametro-de-analise.controller';
import { ParametrosAnaliseService } from './parametro-de-analise.service';
import { ParametrosAnaliseRepository } from './repositories/parametro-de-analise.repository';
import { TipoDeAnaliseModule } from '../tipo-de-analise/tipo-de-analise.module';

@Module({
  imports: [PrismaModule, TipoDeAnaliseModule],
  controllers: [ParametrosAnaliseController],
  providers: [ParametrosAnaliseService, ParametrosAnaliseRepository],
})
export class ParametrosAnaliseModule {}
