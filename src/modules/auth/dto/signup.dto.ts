import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
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
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => (value as string).toUpperCase())
  area: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  funcao: string;

  @IsEnum(Role)
  @MinLength(3)
  role?: Role;
}
