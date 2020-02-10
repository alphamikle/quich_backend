import { Param }                            from '@nestjs/common';
import { MessageService }                   from './message.service';
import { OK }                               from '../helpers/text';
import { SecurePatchAction, TagController } from '../helpers/decorators';

@TagController('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {
  }

  @SecurePatchAction('Прочитать письмо', String, ':messageId')
  async markMessageRead(@Param('messageId') messageId: string): Promise<string> {
    await this.messageService.markMessageRead(messageId);
    return OK;
  }
}
