import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MateriaPrimaController } from './materia-prima.controller';
import { MateriaPrimaRepository } from './repositories/materia-prima.repository';
import { MateriaPrimaService } from './materia-prima.service';

@Module({
  imports: [PrismaModule],
  controllers: [MateriaPrimaController],
  providers: [MateriaPrimaService, MateriaPrimaRepository],
  exports: [MateriaPrimaRepository],
})
export class MateriaPrimaModule {}
