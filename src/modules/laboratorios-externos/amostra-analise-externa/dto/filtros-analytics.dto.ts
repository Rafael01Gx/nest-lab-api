import { IsOptional, IsInt, IsString, IsBoolean, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FiltrosAnalyticsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  laboratorioId?: number;

  @IsOptional()
  @IsString()
  dataInicio?: string;

  @IsOptional()
  @IsString()
  dataFim?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  analiseConcluida?: boolean;
}