import { Module } from '@nestjs/common';
import { TipoDeAnaliseService } from './tipo-de-analise.service';
import { TipoDeAnaliseController } from './tipo-de-analise.controller';
import { TipoAnaliseRepository } from './repositories/tipo-analise.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipoDeAnaliseController],
  providers: [TipoDeAnaliseService, TipoAnaliseRepository],
})
export class TipoDeAnaliseModule {}
