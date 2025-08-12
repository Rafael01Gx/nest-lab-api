import { PartialType } from '@nestjs/mapped-types';
import { CreateElementoQuimicoDto } from './create-elemento-quimico.dto';

export class UpdateElementoQuimicoDto extends PartialType(
  CreateElementoQuimicoDto,
) {}
