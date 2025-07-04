import { Role } from '@prisma/client';

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
