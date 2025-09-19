import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAmostraDto {
  @IsString({ message: 'O número da OS deve ser uma string' })
  @IsNotEmpty({ message: 'O número da OS é obrigatório' })
  @MinLength(5, { message: 'O número da OS deve ter no mínimo 5 caracteres' })
  numeroOs: string;

  @IsString({ message: 'O nome da amostra deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da amostra é obrigatório' })
  @MinLength(3, {
    message: 'O nome da amostra deve ter no mínimo 3 caracteres',
  })
  nomeAmostra: string;

  @IsString({ message: 'A descrição da amostra deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição da amostra é obrigatória' })
  @MinLength(6, {
    message: 'A descrição da amostra deve ter no mínimo 6 caracteres',
  })
  dataAmostra: string;

  @IsArray()
  @IsNotEmpty()
  @MinLength(1)
  ensaiosSolicitados: number[];

  @IsOptional()
  @IsString()
  amostraTipo?: string;

  @IsString()
  userId: string;
}
