import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from '~/message/message.service';
import { MessageController } from '~/message/message.controller';
import { MessageEntity } from '~/message/entity/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageEntity,
    ]),
  ],
  providers: [
    MessageService,
  ],
  controllers: [
    MessageController,
  ],
  exports: [
    MessageService,
  ],
})
export class MessageModule {
}
