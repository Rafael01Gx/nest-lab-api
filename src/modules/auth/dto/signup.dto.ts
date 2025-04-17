import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => value.toUpperCase())
  area: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  funcao: string;
}
