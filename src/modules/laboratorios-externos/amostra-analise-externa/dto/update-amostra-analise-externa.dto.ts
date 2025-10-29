import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAmostraAnaliseExternaDto {
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsArray()
  elementosAnalisados?: [];

  @IsOptional()
  @IsBoolean()
  analiseConcluida: boolean;
}
