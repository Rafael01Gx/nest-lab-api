import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateElementoQuimicoDto {
  @IsString({ message: 'O nome do elemento deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do elemento é obrigatório.' })
  @MinLength(2, {
    message: 'O nome do elemento deve ter ao menos 2 caracteres.',
  })
  elementName: string;

  @IsString({ message: 'O símbolo do elemento deve ser uma string.' })
  @IsNotEmpty({ message: 'O símbolo do elemento é obrigatório.' })
  @MinLength(1, {
    message: 'O símbolo do elemento deve ter ao menos 1 caracter.',
  })
  simbolo: string;
}
