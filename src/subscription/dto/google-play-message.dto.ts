import { GooglePlayDataDto } from './google-play-data.dto';

export class GooglePlayMessageDto {
  data!: string;

  messageId!: string;

  publishTime!: string;

  decodedData?: GooglePlayDataDto;
}
