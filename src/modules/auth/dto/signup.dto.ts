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
  @IsNotEmpty({ message: 'Nome é obrigatório!' })
  @IsString({ message: 'Nome deve ser String' })
  @MinLength(3, { message: 'O campo nome deve conter no min 3 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório!' })
  @IsString({ message: 'Email deve ser String' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória!' })
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Senha fraca' },
  )
  password: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório!' })
  @IsString({ message: 'Telefone deve ser String' })
  @MinLength(10, {
    message: 'O campo telefone deve conter no min 10 caracteres',
  })
  @MaxLength(11, {
    message: 'O campo telefone deve conter no max 11 caracteres',
  })
  phone: string;

  @IsNotEmpty({ message: 'Área é obrigatória!' })
  @IsString({ message: 'Área deve ser String' })
  @MinLength(3, { message: 'O campo área deve conter no min 3 caracteres' })
  @Transform(({ value }) => (value as string).toUpperCase())
  area: string;

  @IsNotEmpty({ message: 'Função é obrigatória!' })
  @IsString({ message: 'Função deve ser String' })
  @MinLength(3, { message: 'O campo função deve conter no min 3 caracteres' })
  funcao: string;

  @IsEnum(Role, { message: 'Função inválida' })
  @MinLength(3, { message: 'O campo role deve conter no min 3 caracteres' })
  role?: Role;
}
