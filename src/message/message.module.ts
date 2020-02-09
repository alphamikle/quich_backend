import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entity/message.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ MessageEntity ]) ],
  providers: [ MessageService ],
  controllers: [ MessageController ],
  exports: [ MessageService ],
})
export class MessageModule {
}
