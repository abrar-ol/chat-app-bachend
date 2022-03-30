import { ChatClient } from './chat-client.model';
import { Injectable } from '@nestjs/common';
import { ChatMessage } from './chat-message.model';

@Injectable()
export class ChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];

  addMessage(message: string, clientId: string): ChatMessage {
    const client = this.clients.find((c: ChatClient) => c.id === clientId);
    const chatMessage: ChatMessage = {
      message: message,
      sender: client,
    };

    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  addClient(id: string, nickname: string): void {
    this.clients.push({ id: id, nickname: nickname });
  }

  getClients(): ChatClient[] {
    return this.clients;
  }
  getMessages(): ChatMessage[] {
    return this.allMessages;
  }
  deleteClient(id: string): void {
    this.clients = this.clients.filter((c) => {
      c.id !== id;
    });
  }
}
