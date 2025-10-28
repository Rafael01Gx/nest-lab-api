import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import {
  AmostraAnaliseExternaModule
} from '../laboratorios-externos/amostra-analise-externa/amostra-analise-externa.module';

@Module({
  imports: [AmostraAnaliseExternaModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {};