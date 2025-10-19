import { forwardRef, Module } from '@nestjs/common';
import { AmostraService } from './amostra.service';
import { AmostraRepository } from './repositories/amostra.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AmostraController } from './amostra.controller';
import { OrdemServicoModule } from '../ordem-servico/ordem-servico.module';

@Module({
  providers: [AmostraService, AmostraRepository],
  controllers: [AmostraController],
  imports: [PrismaModule, forwardRef(()=> OrdemServicoModule)],
  exports: [AmostraRepository],
})
export class AmostraModule {}
