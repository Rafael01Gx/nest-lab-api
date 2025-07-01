import { Module } from '@nestjs/common';
import { TipoAnaliseService } from './tipo-de-analise.service';
import { TipoAnaliseController } from './tipo-de-analise.controller';
import { TipoAnaliseRepository } from './repositories/tipo-analise.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipoAnaliseController],
  providers: [TipoAnaliseService, TipoAnaliseRepository],
  exports: [TipoAnaliseRepository],
})
export class TipoAnaliseModule {}
