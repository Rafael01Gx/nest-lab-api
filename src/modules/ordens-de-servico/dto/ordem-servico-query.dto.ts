import { EStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
import { QueryDto } from 'src/shared/dto/query.dto';

export class OrdemServicoQueryDto extends QueryDto {
  @IsOptional()
  @IsEnum(EStatus, { each: true })
  status?: EStatus[];

  @IsOptional()
  @Type(() => Boolean)
  concluidas?: boolean;

  @IsOptional()
  @Type(() => Number)
  progresso?:number;

  @IsOptional()
  @IsString()
  solicitante?:string;

  @IsOptional()
  @Type(() => Boolean)
  prazoInicioFim?: boolean;

  @IsOptional()
  @IsString()
  dataInicio?: string;

  @IsOptional()
  @IsString()
  dataFim?: string;
}
