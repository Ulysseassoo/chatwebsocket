import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WsJwtAuthGuard } from "src/auth/ws-jwt-auth.guard";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { content: string }): Promise<void> {
    
    const user = await this.usersService.findById(client.data.userId);
    
    const message = {
      id: Date.now(),
      content: payload.content,
      senderId: user.id,
      type: 'message',
      sender: {
        id: user.id,
        username: user.username,
        color: user.color,
        profilePhoto: user.profilePhoto,
      },
      createdAt: new Date().toISOString(),
    };

    this.logger.debug(`Broadcasting message: ${JSON.stringify(message)}`);
    this.server.emit('message', message);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) return;
      const user = await this.usersService.findByIdFromToken(token);
      if (!user) return;
      client.data.userId = user.id;
      this.server.emit('message', {
        id: Date.now(),
        content: `${user.username} vient de rejoindre le chat`,
        senderId: user.id,
        type: 'system',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      this.logger.error('handleConnection error', e);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      if (!client.data.userId) return;
      const user = await this.usersService.findById(client.data.userId);
      if (!user) return;
      this.server.emit('message', {
        id: Date.now(),
        content: `${user.username} vient de quitter le chat`,
        senderId: user.id,
        type: 'system',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      this.logger.error('handleDisconnect error', e);
    }
  }
}
