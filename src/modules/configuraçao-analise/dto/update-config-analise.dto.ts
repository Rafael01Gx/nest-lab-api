import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateConfigAnaliseDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsNumber()
  tipoAnaliseId: number;

  @IsNotEmpty()
  @IsNumber()
  materiaPrimaId: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  parametros: number[];

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
