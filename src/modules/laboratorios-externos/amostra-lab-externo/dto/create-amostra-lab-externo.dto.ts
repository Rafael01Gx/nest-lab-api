import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAmostraLabExternoDto {
  @IsString({ message: 'Formato inválido!' })
  @IsNotEmpty({ message: 'Nome é obrigatório!' })
  @MinLength(2, { message: 'O nome deve conter no mínimo 2 caracteres!' })
  amostraName: string;

  @IsArray({ message: 'Formato inválido!' })
  @IsNumber({}, { each: true, message: 'Cada elemento deve ser um número!' })
  @Type(() => Number)
  elementosAnalisados: number[];
}
