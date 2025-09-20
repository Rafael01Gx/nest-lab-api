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
  @IsNumber({}, { message: 'O id deve ser um número válido.' })
  id?: number;

  @IsString({ message: 'O campo numeroOs deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo numeroOs não pode estar vazio.' })
  @MinLength(5, {
    message: 'O campo numeroOs deve ter no mínimo 5 caracteres.',
  })
  numeroOs: string;

  @IsString({ message: 'O campo nomeAmostra deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nomeAmostra não pode estar vazio.' })
  @MinLength(3, {
    message: 'O campo nomeAmostra deve ter no mínimo 3 caracteres.',
  })
  nomeAmostra: string;

  @IsString({ message: 'O campo dataAmostra deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo dataAmostra não pode estar vazio.' })
  @MinLength(6, {
    message: 'O campo dataAmostra deve ter no mínimo 6 caracteres.',
  })
  dataAmostra: string;

  @IsArray({ message: 'O campo ensaiosSolicitados deve ser um array.' })
  @IsNotEmpty({ message: 'O campo ensaiosSolicitados não pode estar vazio.' })
  @ArrayMinSize(1, {
    message: 'O campo ensaiosSolicitados deve ter no mínimo 1 item.',
  })
  ensaiosSolicitados: ITipoAnalise[] | number[];

  @IsOptional()
  @IsString({ message: 'O campo amostraTipo deve ser uma string.' })
  amostraTipo?: string;

  @IsOptional()
  @IsString({ message: 'O campo amostraDescricao deve ser uma string.' })
  userId: string;

  @IsOptional()
  user: User;

  @IsOptional()
  @IsObject({ message: 'O campo resultados deve ser um objeto.' })
  resultados: object;

  @IsOptional()
  @IsArray({ message: 'O campo analistas deve ser um array.' })
  analistas: User[];

  @IsOptional()
  @IsEnum(EStatus, { message: 'O campo status deve ser um valor válido.' })
  status: EStatus;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber({}, { message: 'O campo progresso deve ser um número.' })
  progresso: number;

  @IsOptional()
  @IsString({ message: 'O campo prazoInicioFim deve ser uma string.' })
  @MinLength(12, {
    message:
      'O campo prazoInicioFim deve ter no mínimo 6 caracteres ex. dd-MM-YYYY - dd-MM-YYYY',
  })
  prazoInicioFim?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message:
      'O campo dataRecepcao deve ter no mínimo 6 caracteres ex. dd-MM-YYYY',
  })
  dataRecepcao: string;

  @IsOptional()
  @IsString({ message: 'O campo createdAt deve ser uma string.' })
  @MinLength(6, {
    message: 'O campo createdAt deve ter no mínimo 6 caracteres.',
  })
  createdAt: Date;

  @IsOptional()
  @IsString({ message: 'O campo updatedAt deve ser uma string.' })
  @MinLength(6, {
    message: 'O campo updatedAt deve ter no mínimo 6 caracteres.',
  })
  updatedAt: Date;
}
