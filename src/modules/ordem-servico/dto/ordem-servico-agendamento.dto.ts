import { Type } from 'class-transformer';
import { IAmostra } from './../../amostra/interfaces/amostra.interface';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UpdateAmostraDto } from 'src/modules/amostra/dto/update-amostra.dto';

export class OrdemServicoAgendamentoDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  dataRecepcao: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  prazoInicioFim: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateAmostraDto)
  amostras: IAmostra[];
}
