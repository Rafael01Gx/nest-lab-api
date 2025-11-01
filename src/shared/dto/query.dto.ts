import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryDto {

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
