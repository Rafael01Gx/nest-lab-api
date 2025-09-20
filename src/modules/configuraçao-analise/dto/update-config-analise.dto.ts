import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateConfigAnaliseDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber({}, { message: 'O ID deve ser um número.' })
  id?: number;

  @IsNotEmpty({ message: 'O nome da descrição é obrigatório.' })
  @IsString({ message: 'O nome da descrição deve ser uma string.' })
  nomeDescricao: string;

  @IsNotEmpty({ message: 'O tipo de análise é obrigatório.' })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber({}, { message: 'O tipo de análise deve ser um número.' })
  tipoAnaliseId: number;

  @IsNotEmpty({ message: 'Os parâmetros são obrigatórios.' })
  @IsArray({ message: 'Os parâmetros devem ser um array de números.' })
  @IsNumber({}, { each: true, message: 'Cada parâmetro deve ser um número.' })
  parametros: number[];

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
