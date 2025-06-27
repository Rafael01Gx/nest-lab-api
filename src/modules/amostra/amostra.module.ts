import { Module } from '@nestjs/common';
import { AmostraService } from './amostra.service';
import { AmostraController } from './amostra.controller';

@Module({
  providers: [AmostraService],
  controllers: [AmostraController],
})
export class AmostraModule {}
