import { IMateriaPrima } from 'src/modules/materia-prima/interfaces/materia-prima.interface';
import { IParametrosAnalise } from 'src/modules/parametro-analise/interfaces/parametro-analise.interface';
import { ITipoAnalise } from 'src/modules/tipo-de-analise/interfaces/tipo-analise.interface';

export interface IConfiguracaoAnalise {
  id: number;
  tipoAnalise: ITipoAnalise;
  tipoAnaliseId?: number;
  materiaPrima: IMateriaPrima;
  materiaPrimaId?: number;
  parametros: IParametrosAnalise[];
  createdAt?: Date;
  updatedAt?: Date;
}
