import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateRemessaLabExternoDto {
  @IsString({
    message: 'A data deve ser um texto.',
  })
  @IsNotEmpty({
    message: 'A data de envio não pode ficar em branco.',
  })
  @MinLength(6, {
    message: 'A data parece incompleta. Por favor, use o formato "AAAA-MM-DD".',
  })
  data: string;

  @IsNotEmpty({
    message:
      'O destino da remessa é obrigatório. Qual é o laboratório de destino?',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  })
  @IsNumber(
    {},
    {
      message: 'O ID do destino deve ser um número válido.',
    },
  )
  destinoId: number;

  @IsNotEmpty({
    message:
      'Você precisa adicionar pelo menos uma amostra para criar a remessa.',
  })
  @IsArray({
    message: 'As amostras devem ser uma lista.',
  })
  @ArrayMinSize(1, {
    message:
      'Você precisa adicionar pelo menos uma amostra para criar a remessa.',
  })
  @ValidateNested({
    each: true,
    message:
      'Algo está errado com as amostras. Verifique se todas as informações estão corretas.',
  })
  @Type(() => AmostraRemessaDto)
  amostras: AmostraRemessaDto[];
}

class AmostraRemessaDto {
  @IsNotEmpty({
    message:
      'O nome da amostra é obrigatório. Como devemos identificar esta amostra?',
  })
  @IsString({
    message: 'O nome da amostra deve ser um texto.',
  })
  @MinLength(3, {
    message: 'O nome da amostra deve ter pelo menos 3 caracteres.',
  })
  amostraName: string;

  @IsOptional()
  @IsString({
    message: 'A sub identificação deve ser um texto.',
  })
  subIdentificacao?: string;

  @IsString({
    message: 'A data de início deve ser um texto.',
  })
  @IsNotEmpty({
    message:
      'A data de início do processo da amostra é obrigatória. Qual a data?',
  })
  @MinLength(4, {
    message:
      'A data de início está incompleta. Por favor, use o formato "AAAA-MM-DD".',
  })
  dataInicio: string;

  @IsString({
    message: 'A data de conclusão deve ser um texto.',
  })
  @IsNotEmpty({
    message:
      'A data de conclusão do processo da amostra é obrigatória. Quando terminou?',
  })
  @MinLength(4, {
    message:
      'A data de conclusão está incompleta. Por favor, use o formato "AAAA-MM-DD".',
  })
  dataFim: string;

  @IsNotEmpty({
    message: 'Você precisa solicitar pelo menos um elemento para esta amostra.',
  })
  @IsArray({
    message: 'Os elementos solicitados devem ser uma lista.',
  })
  @ArrayMinSize(1, {
    message: 'Você precisa solicitar pelo menos um elemento para esta amostra.',
  })
  @IsString({
    each: true,
    message: 'Os elementos solicitados devem ser uma lista de textos.',
  })
  elementosSolicitados: string[];
}
