import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParametrosAnaliseDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  tipo_analise_id: string;

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
