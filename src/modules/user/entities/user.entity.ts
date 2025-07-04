import { Role } from '@prisma/client';

export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  area?: string;
  funcao?: string;
  authorization?: boolean;
  role?: Role;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
