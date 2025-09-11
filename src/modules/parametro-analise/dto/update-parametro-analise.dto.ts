import { PartialType } from '@nestjs/mapped-types';
import { ParametrosAnaliseDto } from './parametro-analise.dto';

export class UpdateParametrosAnaliseDto extends PartialType(
  ParametrosAnaliseDto,
) {}
