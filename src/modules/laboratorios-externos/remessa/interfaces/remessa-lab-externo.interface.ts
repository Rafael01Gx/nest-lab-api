import { JsonValue } from '@prisma/client/runtime/library';
import { ILaboratorio } from '../../laboratorio/interfaces/laboratorio.interface';

export interface IAmostraAnaliseExterna {
  id: number;
  amostraName: string;
  subIdentificacao?: string | null;
  dataInicio: string;
  dataFim: string;
  elementosSolicitados: string[] | JsonValue;
  elementosAnalisados?: string[] | JsonValue;
  analiseConcluida: boolean;
  remessaLabExternoId: number;
}

export interface IRemessaLabExterno {
  id: number;
  data: Date;
  destinoId: number;
  destino: ILaboratorio;
  amostras: IAmostraAnaliseExterna[];
}
