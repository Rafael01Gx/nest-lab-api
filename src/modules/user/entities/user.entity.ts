import { Role } from '@prisma/client';

export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string | null;
  area?: string | null;
  funcao?: string | null;
  authorization?: boolean | null;
  role?: Role;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
