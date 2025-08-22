import { PartialType } from '@nestjs/mapped-types';
import { CreateRemessaLabExternoDto } from './create-remessa-lab-externo.dto';

export class UpdateRemessaLabExternoDto extends PartialType(
  CreateRemessaLabExternoDto,
) {}
