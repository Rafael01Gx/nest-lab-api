import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class AmostraAnaliseExternaQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if(!value) return undefined;
    if (value.toUpperCase() === 'TRUE' || value == 1) return  value = true;
    if (value.toUpperCase() === 'FALSE' || value == 0) return value = false;
    return undefined;
  })
  @IsBoolean()
  analiseConcluida?: boolean;

  @IsOptional()
  @IsString()
  dataInicio?: string;

  @IsOptional()
  @IsString()
  dataFim?: string;

  @IsOptional()
  @IsString()
  amostraName?: string;

  @IsOptional()
  @Type(() => Number)
  labExternoId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
