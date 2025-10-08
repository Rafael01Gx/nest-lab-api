import { EStatus } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { ITipoAnalise } from 'src/modules/tipo-de-analise/interfaces/tipo-analise.interface';
import { User } from 'src/modules/user/entities/user.entity';

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
