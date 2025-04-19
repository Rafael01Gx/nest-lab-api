import { Role } from 'src/modules/auth/enum/roles.enum';

export type UserPayload = {
  sub: string;
  name: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
};
