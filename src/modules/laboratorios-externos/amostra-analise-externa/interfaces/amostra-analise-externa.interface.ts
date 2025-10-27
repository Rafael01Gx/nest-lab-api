import { ElementoQuimico } from '@prisma/client';

export interface IAmostraLabExterno {
  id: number;
  amostraName: string;
  elementosAnalisados: number[] | ElementoQuimico[];
}
