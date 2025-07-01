export interface IParametrosAnalise {
  id?: string;
  tipo_de_analise_id: string;
  descricao: string;
  unidade_de_medida?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
