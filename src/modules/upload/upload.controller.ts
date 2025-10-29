import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ROUTES } from '../../common/constants/routes.constant';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UploadConfig } from './interfaces/upload.interface';

const {UPLOAD} = ROUTES;
@Roles(Role.ADMIN, Role.OPERADOR)
@Controller(UPLOAD.BASE)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(UPLOAD.POST.UPLOAD_RESULTADO)
  @UseInterceptors(FileInterceptor('file'))
  uploadFileResultado(@UploadedFile() file: Express.Multer.File, @Body('config') config:UploadConfig) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const allowedTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato de arquivo inválido. Use .xls ou .xlsx',
      );
    }

    return this.uploadService.adicionaResultado(file.buffer,config);
  }
}
