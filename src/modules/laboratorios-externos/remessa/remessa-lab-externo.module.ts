import { RemessaLabExternoRepository } from './repositories/remessa-lab-externo.repository';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RemessaLabExternoService } from './remessa-lab-externo.service';
import { RemessaLabExternoController } from './remessa-lab-externo.controller';

@Module({
  providers: [RemessaLabExternoService, RemessaLabExternoRepository],
  controllers: [RemessaLabExternoController],
  imports: [PrismaModule],
  exports: [RemessaLabExternoRepository],
})
export class RemessaLabExternoModule {}
