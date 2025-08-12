import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAmostraDto {
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
  @MinLength(1)
  ensaiosSolicitados: number[];

  @IsOptional()
  @IsString()
  amostraTipo?: string;

  @IsString()
  userId: string;
}
