import { EStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { ITipoAnalise } from 'src/modules/tipos-de-analises/interfaces/tipo-analise.interface';
import { User } from 'src/modules/users/entities/user.entity';

export interface IAmostra {
  id: number;
  numeroOs: string;
  nomeAmostra: string;
  dataAmostra: string;
  ensaiosSolicitados: ITipoAnalise[] | number[];
  amostraTipo?: string | null;
  userId: string;
  user?: User;
  resultados?: JsonValue | null | undefined;
  analistas?: string[] | JsonValue | null | undefined;
  revisor?: string | null;
  status: EStatus;
  progresso?: number | null;
  prazoInicioFim?: string;
  dataRecepcao?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgendamentoSemanal {
  semana: string;
  dataInicio: string;
  dataFim: string;
  tiposAnalise: {
    tipo: string;
    classe: string;
    quantidade: number;
    amostras: {
      id: number;
      nomeAmostra: string;
      numeroOs: string;
      prazoInicioFim: string;
      status: string;
    }[];
  }[];
  totalAmostras: number;
}
