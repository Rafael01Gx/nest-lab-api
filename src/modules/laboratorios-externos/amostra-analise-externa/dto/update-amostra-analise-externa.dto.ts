import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAmostraAnaliseExternaDto {

  @IsOptional()
  elementosAnalisados? : [];

  @IsOptional()
  @IsBoolean()
  analiseConcluida : boolean;
}
