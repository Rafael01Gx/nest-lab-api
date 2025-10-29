import { ILaboratorio } from '../../laboratorio/interfaces/laboratorio.interface';
import { JsonValue } from '@prisma/client/runtime/library';

export interface IAmostraAnaliseExterna {
  id: number;
  amostraName: string;
  subIdentificacao?: string;
  dataInicio: string;
  dataFim: string;
  elementosSolicitados: string[] | JsonValue;
  elementosAnalisados?: null | Record<string, {}> | JsonValue;
  analiseConcluida: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  remessaLabExternoId: number;
  remessaLabExterno?: {
    id?: number;
    data?: Date;
    destinoId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    destino?: ILaboratorio;
  };
}

export interface AmostrasAnalyticsDto {
  amostras: AmostrasComRelacoes[];
  estatisticas: EstatisticasGerais;
}

export interface AmostrasComRelacoes {
  id: number;
  amostraName: string;
  subIdentificacao: string;
  dataInicio: string;
  dataFim: string;
  elementosSolicitados: string[];
  elementosAnalisados: any;
  analiseConcluida: boolean;
  createdAt: Date;
  updatedAt: Date;
  remessaLabExternoId: number;
  RemessaLabExterno: {
    data: Date;
    destino: {
      id: number;
      nome: string;
      endereco: string;
      telefone: string;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

export interface EstatisticasGerais {
  totalAmostras: number;
  amostrasCompletas: number;
  amostrasIncompletas: number;
  percentualConclusao: number;
  totalLaboratorios: number;
  totalRemessas: number;
  mediaElementosPorAmostra: number;
}

export interface FiltrosAnalytics {
  laboratorioId?: number;
  dataInicio?: Date | string;
  dataFim?: Date | string;
  analiseConcluida?: boolean;
}

