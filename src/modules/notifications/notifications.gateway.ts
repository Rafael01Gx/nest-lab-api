import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedSocket } from './interfaces/authenticated-socket.interface';
@WebSocketGateway({
  namespace: '/',
  path: '/socket.io',
  transports: ['websocket'],
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Set<string>>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(@ConnectedSocket() socket: AuthenticatedSocket) {
    try {
      const token = this.extractTokenFromCookie(socket);

      if (!token) {
        socket.emit('error', {
          message: 'Token de autenticação não encontrado',
        });
        socket.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      socket.user = {
        id: payload.sub || payload.userId || payload.id,
        role: payload.role,
        email: payload.email,
      };

      const { id: userId, role } = socket.user;

      if (!this.connectedUsers.has(userId)) {
        this.connectedUsers.set(userId, new Set());
      }
      this.connectedUsers.get(userId)!.add(socket.id);

      socket.join(role);
      socket.join(`user:${userId}`);

      socket.emit('connected', {
        userId,
        role,
        socketId: socket.id,
      });
    } catch (error) {
      socket.emit('error', { message: 'Falha na autenticação' });
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: AuthenticatedSocket) {
    if (!socket.user) return;

    const userId = socket.user.id;

    if (this.connectedUsers.has(userId)) {
      const userSockets = this.connectedUsers.get(userId)!;
      userSockets.delete(socket.id);

      if (userSockets.size === 0) {
        this.connectedUsers.delete(userId);
      }
    }
  }

  private extractTokenFromCookie(socket: Socket): string | null {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return null;
    }
    const cookieName = 'access_token';

    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith(`${cookieName}=`),
    );

    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }

    return null;
  }

  notifyAdmins(notification: any) {
    this.server.to('ADMIN').emit('new-notification', notification);
  }

  notifyUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('new-notification', notification);
  }

  notifyUsers(userIds: string[], notification: any) {
    userIds.forEach((userId) => {
      this.server.to(`user:${userId}`).emit('new-notification', notification);
    });
  }

  notifyAll(notification: any) {
    this.server.emit('new-notification', notification);
  }

  // ============= MÉTODOS DE VERIFICAÇÃO =============

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  getUserConnectionCount(userId: string): number {
    return this.connectedUsers.get(userId)?.size || 0;
  }

  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  getConnectionStats() {
    const users = Array.from(this.connectedUsers.entries()).map(
      ([userId, sockets]) => ({
        userId,
        connections: sockets.size,
      }),
    );

    const totalSockets = users.reduce((sum, user) => sum + user.connections, 0);

    return {
      totalUsers: this.connectedUsers.size,
      totalSockets,
      users,
      timestamp: new Date().toISOString(),
    };
  }

  getUserDetails(userId: string) {
    const sockets = this.connectedUsers.get(userId);

    if (!sockets) {
      return null;
    }

    return {
      userId,
      isOnline: true,
      connections: sockets.size,
      socketIds: Array.from(sockets),
    };
  }

  disconnectUser(userId: string) {
    const sockets = this.connectedUsers.get(userId);

    if (!sockets) {
      return false;
    }

    sockets.forEach((socketId) => {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit('force-disconnect', {
          reason: 'Sessão encerrada pelo servidor',
        });
        socket.disconnect(true);
      }
    });

    this.connectedUsers.delete(userId);
    return true;
  }
}
