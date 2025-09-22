import { EStatus } from '@prisma/client';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';

export class AmostraQueryDto {
  @IsOptional()
  @IsEnum(EStatus, { each: true })
  status?: EStatus[];

  @IsOptional()
  @IsNumberString()
  prazoInicioFim: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
