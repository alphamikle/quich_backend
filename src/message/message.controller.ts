import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { OK } from '../helpers/text';
import { Guards } from '../helpers/guards';

@ApiUseTags('message')
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Patch(':messageId')
  @ApiOperation({ title: 'Прочитать письмо' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async markMessageRead(@Param('messageId') messageId: string): Promise<string> {
    await this.messageService.markMessageRead(messageId);
    return OK;
  }
}
