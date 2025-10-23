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

  @IsString({ message: 'O nome da amostras deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da amostras é obrigatório' })
  @MinLength(3, {
    message: 'O nome da amostras deve ter no mínimo 3 caracteres',
  })
  nomeAmostra: string;

  @IsString({ message: 'A descrição da amostras deve ser uma string' })
  @IsNotEmpty({ message: 'A descrição da amostras é obrigatória' })
  @MinLength(6, {
    message: 'A descrição da amostras deve ter no mínimo 6 caracteres',
  })
  dataAmostra: string;

  @IsArray({ message: 'Ensaios solicitados deve ser um array' })
  @IsNotEmpty({ message: 'Ensaios solicitados é obrigatório' })
  @MinLength(1, { message: 'Deve haver no mínimo 1 ensaio solicitado' })
  ensaiosSolicitados: number[];

  @IsOptional({ message: 'Tipo da amostras é opcional' })
  @IsString({ message: 'O tipo da amostras deve ser uma string' })
  amostraTipo?: string;

  @IsString({ message: 'O ID do usuário deve ser uma string' })
  userId: string;
}
