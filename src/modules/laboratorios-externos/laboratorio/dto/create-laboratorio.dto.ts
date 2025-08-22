import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class EnderecoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  cep: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  logradouro: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  numero: string;

  @IsOptional()
  @IsString()
  complemento: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  bairro: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  cidade: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  estado: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  pais: string;
}
export class CreateLaboratorioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nome: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;

  @IsOptional()
  @IsString()
  @MinLength(10)
  telefone?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  email?: string;
}
