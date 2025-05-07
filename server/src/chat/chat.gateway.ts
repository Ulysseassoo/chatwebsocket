import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WsJwtAuthGuard } from "src/auth/ws-jwt-auth.guard";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { content: string }): Promise<void> {
    this.logger.debug(`Received message from client ${client.id}: ${payload.content}`);
    
    const user = await this.usersService.findById(client.data.userId);
    this.logger.debug(`User found: ${user.username}`);
    
    const message = {
      id: Date.now(),
      content: payload.content,
      senderId: user.id,
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
}
