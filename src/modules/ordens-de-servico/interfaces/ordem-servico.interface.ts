import { IAmostra } from 'src/modules/amostras/interfaces/amostra.interface';
import { User } from 'src/modules/users/entities/user.entity';

export interface IOrdemServico {
  id: string;
  solicitanteId: string;
  solicitante: User;
  amostras: IAmostra[];
  status?: string;
  dataRecepcao?: string;
  prazoInicioFim?: string;
  progresso?: number | null;
  observacao?: string;
  revisorId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
