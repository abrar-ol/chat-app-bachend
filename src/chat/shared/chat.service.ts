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

  addClient(id: string, nickname: string): ChatClient {
    let chatClient = this.clients.find(
      (c: ChatClient) => c.id === id && c.nickname === nickname,
    );
    if (chatClient) {
      return chatClient;
    }
    if (this.clients.find((c: ChatClient) => c.nickname === nickname)) {
      throw new Error('Nickname Already used');
    }
    chatClient = { id: id, nickname: nickname, typing: false };
    this.clients.push(chatClient);
    return chatClient;
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
  updateTyping(typing: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c: ChatClient) => c.id === id);
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      return chatClient;
    }
  }
}
