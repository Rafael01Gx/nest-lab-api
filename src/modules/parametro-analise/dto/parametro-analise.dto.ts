import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ParametrosAnaliseDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsNumber()
  tipo_analise_id: number;

  @IsNotEmpty()
  @IsString()
  descricao: string;

  @IsOptional()
  @IsString()
  unidade_medida: string | null;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
