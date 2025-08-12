import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateElementoQuimicoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  elementName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  simbolo: string;
}
