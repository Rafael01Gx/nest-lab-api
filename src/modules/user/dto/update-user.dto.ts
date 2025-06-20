import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/modules/auth/enum/roles.enum';

export class UpdateUserDto extends PartialType(UserDto) {
  @IsOptional()
  @IsString()
  @IsEnum(Role)
  role?: string;
}
