import { GooglePlayMessageDto } from './google-play-message.dto';
import { Sku, Status } from '../entities/subscription.entity';

export class GooglePlayHookDto {

  message!: GooglePlayMessageDto;


  subscription!: string;


  actionDate?: Date;


  endDate?: Date;


  status?: Status;


  sku?: Sku;
}
