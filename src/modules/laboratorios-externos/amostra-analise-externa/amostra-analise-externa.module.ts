import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AmostraLabExternoRepository } from './repositories/amostra-lab-externo.repository';
import { AmostraLabExternoController } from './amostra-lab-externo.controller';
import { AmostraLabExternoService } from './amostra-lab-externo.service';

@Module({
  providers: [AmostraLabExternoService, AmostraLabExternoRepository],
  controllers: [AmostraLabExternoController],
  imports: [PrismaModule],
  exports: [AmostraLabExternoRepository],
})
export class AmostraLabExternoModule {}
