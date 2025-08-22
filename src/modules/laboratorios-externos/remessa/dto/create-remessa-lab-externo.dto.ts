import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateRemessaLabExternoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  data: string;

  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber()
  destinoId: number;

  @IsNotEmpty()
  @MinLength(1)
  @ValidateNested({ each: true })
  @Type(() => AmostraRemessaDto)
  amostras: AmostraRemessaDto[];
}

class AmostraRemessaDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  amostraName: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  subIdentificacao?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  dataInicio: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  dataFim: string;

  @IsNotEmpty()
  @IsArray()
  @MinLength(1)
  @IsString({ each: true })
  elementosSolicitados: string[];
}
