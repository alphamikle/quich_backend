import { GooglePlayMessageDto } from '~/subscription/dto/google-play-message.dto';
import { Sku, Status } from '~/subscription/entities/subscription.entity';

export class GooglePlayHookDto {

  message!: GooglePlayMessageDto;


  subscription!: string;


  actionDate?: Date;


  endDate?: Date;


  status?: Status;


  sku?: Sku;
}
