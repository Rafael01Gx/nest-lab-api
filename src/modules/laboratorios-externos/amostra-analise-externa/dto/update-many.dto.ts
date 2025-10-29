import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateAmostraAnaliseExternaDto } from './update-amostra-analise-externa.dto';
import { Type } from 'class-transformer';

export class UpdateManyDto {
  @IsNotEmpty({ message: 'A lista de amostras não pode ser vazia.' })
  @IsArray({ message: 'Deve ser um array de amostras.' })
  @Type(() => UpdateAmostraAnaliseExternaDto)
  @ValidateNested({ each: true })
  amostras: UpdateAmostraAnaliseExternaDto[];
}
