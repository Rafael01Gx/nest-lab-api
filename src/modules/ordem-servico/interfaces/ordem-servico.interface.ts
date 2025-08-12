import { IAmostra } from 'src/modules/amostra/interfaces/amostra.interface';
import { User } from 'src/modules/user/entities/user.entity';

export interface IOrdemServico {
  id: string;
  solicitanteId: string;
  solicitante: User;
  amostras: IAmostra[];
  status?: string;
  dataRecepcao?: string;
  prazoInicioFim?: string;
  progresso?: string;
  observacao?: string;
  revisorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
