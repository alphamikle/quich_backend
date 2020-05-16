import { Controller } from '@nestjs/common';
import { MessageService } from '~/message/message.service';
import { securedGrpc } from '~/providers/decorators';
import { MessageIdDto } from '~/message/dto/message-id.dto';
import { Empty } from '~/providers/empty';
import * as message from '~/proto-generated/message';

@Controller()
export class MessageController implements message.MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {
  }

  @securedGrpc
  async markMessageRead({ messageId }: MessageIdDto): Promise<Empty> {
    await this.messageService.markMessageRead(messageId);
    return new Empty();
  }
}
