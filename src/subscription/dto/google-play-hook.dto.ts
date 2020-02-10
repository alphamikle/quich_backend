import { ApiModelProperty }     from '@nestjs/swagger';
import { GooglePlayMessageDto } from './google-play-message.dto';
import { Sku, Status }          from '../entities/subscription.entity';

export class GooglePlayHookDto {
  @ApiModelProperty()
  message!: GooglePlayMessageDto;

  @ApiModelProperty()
  subscription!: string;

  @ApiModelProperty()
  actionDate?: Date;

  @ApiModelProperty()
  endDate?: Date;

  @ApiModelProperty()
  status?: Status;

  @ApiModelProperty()
  sku?: Sku;
}
