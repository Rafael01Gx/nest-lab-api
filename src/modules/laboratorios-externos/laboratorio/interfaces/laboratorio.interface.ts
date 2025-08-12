import { JsonValue } from '@prisma/client/runtime/library';

export interface ILaboratorio {
  id: number;
  nome: string;
  endereco: Endereco | JsonValue;
  telefone?: string | null;
  email?: string | null;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
}
