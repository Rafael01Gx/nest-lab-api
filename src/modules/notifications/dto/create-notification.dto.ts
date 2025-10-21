import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsDateString()
  data?: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean = false;

  @IsString()
  userId: string;
}
