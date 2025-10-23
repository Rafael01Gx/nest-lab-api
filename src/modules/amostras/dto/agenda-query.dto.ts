import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';

export class AgendaQueryDto {
  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  classe?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  status?: string[];

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;
}