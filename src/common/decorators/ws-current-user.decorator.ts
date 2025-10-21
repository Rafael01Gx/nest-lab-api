import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

export const WsCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client: Socket = ctx.switchToWs().getClient();
    return client['user'];
  },
);