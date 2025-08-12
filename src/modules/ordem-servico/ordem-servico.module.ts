import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OrdemServicoController } from './ordem-servico.controller';
import { OrdemServicoService } from './ordem-servico.service';
import { OrdemServicoRepository } from './repositories/ordem-servico.repository';

@Module({
  imports: [PrismaModule],
  controllers: [OrdemServicoController],
  providers: [OrdemServicoService, OrdemServicoRepository],
  exports: [OrdemServicoRepository],
})
export class OrdemServicoModule {}
