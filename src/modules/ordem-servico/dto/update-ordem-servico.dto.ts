import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateOrdemServicoDto {
  @IsOptional()
  @IsNumber()
  id?: number;

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
  @IsNumber({}, { each: true })
  parametros: number[];

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
