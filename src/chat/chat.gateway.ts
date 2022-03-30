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
    allMessages:string[]=[];
    clients:Map<string,string>=new Map<string,string>();

  @WebSocketServer() server;
  private readonly logger = new Logger(ChatGateway.name);

  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() message: string): string {
    this.logger.log(message);
    this.allMessages.push(message);
    this.server.emit('newMessage', message);
    return message + 'Hello';
  }

  @SubscribeMessage('nickname')
  handleNicknameEvent(
      @MessageBody() nickname: string,
      @ConnectedSocket() client:Socket): void {
    this.clients.set(client.id,nickname);
    this.logger.log('all nicknames: ');
    this.clients.forEach((nickname: string, id: string) => {
        this.logger.log(nickname+'  =>  '+id);
    });

    this.server.emit('clients',Array.from(this.clients.values()));

  }

  afterInit(server: any) {
    this.logger.log('Websocket Server Started,Listening on Port:3000');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log('client connect: ', client.id);
    client.emit('allMessages',this.allMessages);
  }

  handleDisconnect(client: Socket): any {
    this.clients.delete(client.id);
    this.logger.log('client disconnect: ');
    this.clients.forEach((nickname: string, id: string) => {
        this.logger.log(nickname+'  =>  '+id);
    });
  }
}
