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
  @IsString({ message: 'O CEP deve ser uma string.' })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @MinLength(5, { message: 'O CEP deve ter ao menos 5 caracteres.' })
  cep: string;

  @IsString({ message: 'O logradouro deve ser uma string.' })
  @IsNotEmpty({ message: 'O logradouro é obrigatório.' })
  @MinLength(5, { message: 'O logradouro deve ter ao menos 5 caracteres.' })
  logradouro: string;

  @IsString({ message: 'O número deve ser uma string.' })
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @MinLength(1, { message: 'O número deve ter ao menos 1 caracter.' })
  numero: string;

  @IsOptional({ message: 'O complemento deve ser uma string.' })
  @IsString({ message: 'O complemento deve ser uma string.' })
  complemento: string;

  @IsString({ message: 'O bairro deve ser uma string.' })
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @MinLength(3, { message: 'O bairro deve ter ao menos 3 caracteres.' })
  bairro: string;

  @IsString({ message: 'A cidade deve ser uma string.' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @MinLength(3, { message: 'A cidade deve ter ao menos 3 caracteres.' })
  cidade: string;

  @IsString({ message: 'O estado deve ser uma string.' })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @MinLength(2, { message: 'O estado deve ter ao menos 2 caracteres.' })
  estado: string;

  @IsString({ message: 'O país deve ser uma string.' })
  @IsNotEmpty({ message: 'O país é obrigatório.' })
  @MinLength(2, { message: 'O país deve ter ao menos 2 caracteres.' })
  pais: string;
}
export class CreateLaboratorioDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MinLength(3, { message: 'O nome deve ter ao menos 3 caracteres.' })
  nome: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsObject({ message: 'O endereço deve ser um objeto.' })
  @ValidateNested({ message: 'O endereço deve ser um objeto válido.' })
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;

  @IsOptional({ message: 'O telefone deve ser uma string.' })
  @IsString({ message: 'O telefone deve ser uma string.' })
  @MinLength(10, { message: 'O telefone deve ter ao menos 10 caracteres.' })
  telefone?: string;

  @IsOptional({ message: 'O email deve ser uma string.' })
  @IsString({ message: 'O email deve ser uma string.' })
  @MinLength(5, { message: 'O email deve ter ao menos 5 caracteres.' })
  email?: string;
}
