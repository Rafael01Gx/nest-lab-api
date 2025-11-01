import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { QueryDto } from 'src/shared/dto/query.dto';

export class AmostraAnaliseExternaQueryDto extends QueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value.toUpperCase() === 'TRUE' || value == 1) return  value = true;
    if (value.toUpperCase() === 'FALSE' || value == 0) return value = false;
    if(!value) return undefined;
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

}
