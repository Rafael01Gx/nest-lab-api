import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsString()
  id?: string;

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
  area: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  funcao: string;

  @IsBoolean()
  authorization: boolean;
}
