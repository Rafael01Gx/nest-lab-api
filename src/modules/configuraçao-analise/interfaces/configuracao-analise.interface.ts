import { IParametrosAnalise } from 'src/modules/parametro-analise/interfaces/parametro-analise.interface';
import { ITipoAnalise } from 'src/modules/tipo-de-analise/interfaces/tipo-analise.interface';

export interface IConfiguracaoAnalise {
  id: number;
  nomeDescricao: string;
  tipoAnalise: ITipoAnalise;
  tipoAnaliseId?: number;
  parametros: IParametrosAnalise[] | number[];
  createdAt?: Date;
  updatedAt?: Date;
}
