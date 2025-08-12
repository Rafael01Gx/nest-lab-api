import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ElementoQuimicoRepository } from './repositories/elemento-quimico.repository';
import { ElementoQuimicoController } from './elemento-quimico.controller';
import { ElementoQuimicoService } from './elemento-quimico.service';

@Module({
  providers: [ElementoQuimicoService, ElementoQuimicoRepository],
  controllers: [ElementoQuimicoController],
  imports: [PrismaModule],
  exports: [ElementoQuimicoRepository],
})
export class ElementoQuimicoModule {}
