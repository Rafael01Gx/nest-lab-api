import { PartialType } from '@nestjs/mapped-types';
import { CreateAmostraLabExternoDto } from './create-amostra-lab-externo.dto';

export class UpdateAmostraLabExternoDto extends PartialType(
  CreateAmostraLabExternoDto,
) {}
