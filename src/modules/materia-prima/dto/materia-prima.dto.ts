import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class MateriaPrimaDto {
  @IsOptional()
  @IsNumber({}, { message: 'O ID deve ser um número válido.' })
  id?: number;

  @IsNotEmpty({ message: 'O nome ou descrição é obrigatório.' })
  @IsString({ message: 'O nome ou descrição deve ser um texto.' })
  @MinLength(3, {
    message: 'O nome ou descrição deve ter pelo menos 3 caracteres.',
  })
  nomeDescricao: string;

  @IsNotEmpty({ message: 'A classe/tipo é obrigatória.' })
  @IsString({ message: 'A classe/tipo deve ser um texto.' })
  @MinLength(3, {
    message: 'A classe/tipo deve ter pelo menos 3 caracteres.',
  })
  classeTipo: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
