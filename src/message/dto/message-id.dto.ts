import * as message from '~/proto-generated/message';

export class MessageIdDto implements message.MessageIdDto {
  messageId!: string;
}