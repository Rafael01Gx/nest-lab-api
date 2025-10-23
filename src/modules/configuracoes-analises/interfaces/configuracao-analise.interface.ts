import { IParametrosAnalise } from 'src/modules/parametros-analises/interfaces/parametro-analise.interface';
import { ITipoAnalise } from 'src/modules/tipos-de-analises/interfaces/tipo-analise.interface';

export interface IConfiguracaoAnalise {
  id: number;
  nomeDescricao: string;
  tipoAnalise: ITipoAnalise;
  tipoAnaliseId?: number;
  parametros: IParametrosAnalise[] | number[];
  createdAt?: Date;
  updatedAt?: Date;
}
