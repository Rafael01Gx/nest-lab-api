export class AmostraDetalhesDto {
  id: number;
  nomeAmostra: string;
  numeroOs: string;
  prazoInicioFim: string;
  status: string;
  dataRecepcao: string;
  progresso: number;
}

export class TipoAnaliseDto {
  tipo: string;
  classe: string;
  quantidade: number;
  amostras: AmostraDetalhesDto[];
}

export class AgendamentoSemanalDto {
  semana: string;
  dataInicio: string;
  dataFim: string;
  tiposAnalise: TipoAnaliseDto[];
  totalAmostras: number;
  numeroSemana: number;
}

export class EstatisticasDto {
  totalAmostras: number;
  totalSemanas: number;
  tiposUnicos: number;
  distribuicaoPorStatus: {
    execucao: number;
    autorizada: number;
  };
  distribuicaoPorClasse: Record<string, number>;
}