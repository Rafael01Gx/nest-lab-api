import { EStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOrdemServicoDto {
  @IsNotEmpty()
  @IsEnum(EStatus)
  status: EStatus;

  @IsOptional()
  @IsString()
  observacao?: string;
}
