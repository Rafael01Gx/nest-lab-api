import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateConfigAnaliseDto {
  @IsNotEmpty()
  @IsString()
  nomeDescricao: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber()
  tipoAnaliseId: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty({ message: 'É necessário informar ao menos um parâmetro.' })
  @IsNumber({}, { each: true })
  parametros: number[];
}
