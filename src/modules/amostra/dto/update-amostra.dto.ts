import { EStatus, User } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ITipoAnalise } from 'src/modules/tipo-de-analise/interfaces/tipo-analise.interface';

export class UpdateAmostraDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  numeroOs: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nomeAmostra: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  dataAmostra: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  ensaiosSolicitados: ITipoAnalise[] | number[];

  @IsOptional()
  @IsString()
  amostraTipo?: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  user: User;

  @IsOptional()
  @IsObject()
  resultados: object;

  @IsOptional()
  @IsArray()
  analistas: User[];

  @IsOptional()
  @IsEnum(EStatus)
  status: EStatus;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber()
  progresso: number;

  @IsOptional()
  @IsString()
  @MinLength(6)
  prazoInicioFim?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  dataRecepcao: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  createdAt: Date;

  @IsOptional()
  @IsString()
  @MinLength(6)
  updatedAt: Date;
}
