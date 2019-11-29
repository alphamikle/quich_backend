import { GphMessageDto } from './gph-message.dto';

export class GooglePlayHookDto {
  message: GphMessageDto;
  subscription!: string;
}
