import { ChatService } from './shared/chat.service';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect,OnGatewayInit {
   constructor(private chatService:ChatService){}

  @WebSocketServer() server;
  private readonly logger = new Logger(ChatGateway.name);

  @SubscribeMessage('message')
  handleChatEvent(
      @MessageBody() message: string,
      @ConnectedSocket() client:Socket): void {
    const chatMessage = this.chatService.addMessage(message,client.id);
    this.server.emit('newMessage', chatMessage);
  }

  @SubscribeMessage('nickname')
  handleNicknameEvent(
      @MessageBody() nickname: string,
      @ConnectedSocket() client:Socket): void {
          this.chatService.addClient(client.id,nickname);
          this.server.emit('clients',this.chatService.getClients());
  }

  afterInit(server: any) {
    this.logger.log('Websocket Server Started,Listening on Port:3000');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    client.emit('allMessages',this.chatService.getMessages());
    this.server.emit('clients',this.chatService.getClients());
  }

  handleDisconnect(client: Socket): any {
    this.chatService.deleteClient(client.id);
    this.server.emit('clients',this.chatService.getClients());

  }
}
