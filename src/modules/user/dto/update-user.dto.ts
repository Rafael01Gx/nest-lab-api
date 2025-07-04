import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto extends PartialType(UserDto) {
  @IsOptional()
  @IsString()
  @IsEnum(Role)
  role?: Role;
}
