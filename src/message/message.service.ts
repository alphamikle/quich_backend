import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '~/message/entity/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageEntityRepository: Repository<MessageEntity>,
  ) {
  }

  async markMessageRead(messageId: string): Promise<void> {
    await this.messageEntityRepository.update({ id: messageId }, { isRead: true });
  }

  async getUnreadUserMessages(userId: string): Promise<MessageEntity[]> {
    const messages = await this.messageEntityRepository.find({
      where: {
        isRead: false,
        userId,
      },
    });
    return messages;
  }
}
