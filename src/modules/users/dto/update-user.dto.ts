import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto extends PartialType(UserDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  oldPassword?: string;
}
