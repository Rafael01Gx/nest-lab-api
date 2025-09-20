import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateConfigAnaliseDto {
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
  @ArrayNotEmpty({ message: 'É necessário informar ao menos um parâmetro.' })
  @IsNumber({}, { each: true, message: 'Cada parâmetro deve ser um número.' })
  parametros: number[];
}
