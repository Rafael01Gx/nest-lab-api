export interface IParametrosAnalise {
  id?: number;
  tipoAnaliseId?: number;
  descricao: string;
  unidadeMedida?: string | null;
  unidadeResultado?: string | null;
  casasDecimais?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
