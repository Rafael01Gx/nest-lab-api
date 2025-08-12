import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IAmostra } from 'src/modules/amostra/interfaces/amostra.interface';

export class CreateOrdemServicoDto {
  @IsOptional()
  @IsString()
  id?: number;

  @IsNotEmpty()
  @IsArray()
  amostras: Partial<IAmostra[]>;
}
