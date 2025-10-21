import { Role } from '@prisma/client';
import {Socket } from 'socket.io';
export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    role: Role;
    email: string;
  };
}