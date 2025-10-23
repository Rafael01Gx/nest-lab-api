import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfiguracaoAnaliseController } from './configuracao-analise.controller';
import { ConfiguracaoAnaliseRepository } from './repositories/configuracao-analise.repository';
import { ConfiguracaoAnaliseService } from './configuracao-analise.service';
import { TipoAnaliseModule } from '../tipos-de-analises/tipo-analise.module';
import { ParametrosAnaliseModule } from '../parametros-analises/parametro-analise.module';
import { MateriaPrimaModule } from '../materias-primas/materia-prima.module';

@Module({
  imports: [
    PrismaModule,
    TipoAnaliseModule,
    ParametrosAnaliseModule,
    MateriaPrimaModule,
  ],
  controllers: [ConfiguracaoAnaliseController],
  providers: [ConfiguracaoAnaliseService, ConfiguracaoAnaliseRepository],
  exports: [ConfiguracaoAnaliseRepository],
})
export class ConfiguracaoAnaliseModule {}
