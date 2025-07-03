import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConfigAnaliseDto {
  @IsNotEmpty()
  @IsNumber()
  tipoAnaliseId: number;

  @IsNotEmpty()
  @IsNumber()
  materiaPrimaId: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty({ message: 'É necessário informar ao menos um parâmetro.' })
  @IsNumber({}, { each: true })
  parametros: number[];
}
