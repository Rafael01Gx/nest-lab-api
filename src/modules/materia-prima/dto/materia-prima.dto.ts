import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class MateriaPrimaDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  nome_descricao: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  classe_tipo: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
