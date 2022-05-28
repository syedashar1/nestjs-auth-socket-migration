import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = [{ name: 'Ashar', message: 'first message' }];
  clientToUser = {};

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return Object.values(this.clientToUser);
  }

  getClientByName(id: string) {
    return this.clientToUser[id];
  }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      message: createMessageDto.message,
    };
    // const message = { ...createMessageDto };
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  joinRoom() {
    return this.messages;
  }

  async typing() {
    return this.messages;
  }
}
