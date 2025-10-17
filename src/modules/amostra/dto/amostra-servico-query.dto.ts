import { EStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class AmostraQueryDto {
  @IsOptional()
  @IsEnum(EStatus, { each: true })
  status?: EStatus[];

  @IsOptional()
  @IsNumberString()
  prazoInicioFim?: string;

  @IsOptional()
  @IsString()
  dataInicio?: string;

  @IsOptional()
  @IsString()
  dataFim?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
