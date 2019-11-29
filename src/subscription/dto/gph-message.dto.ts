import { GphDataDto } from './gph-data.dto';

export class GphMessageDto {
  data!: string;
  messageId!: string;
  publishTime!: string;
  decodedData?: GphDataDto;
}
