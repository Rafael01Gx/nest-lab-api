import { Module } from '@nestjs/common';
import { AmostraService } from './amostra.service';
import { AmostraRepository } from './repositories/amostra.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AmostraController } from './amostra.controller';

@Module({
  providers: [AmostraService, AmostraRepository],
  controllers: [AmostraController],
  imports: [PrismaModule],
  exports: [AmostraRepository],
})
export class AmostraModule {}
