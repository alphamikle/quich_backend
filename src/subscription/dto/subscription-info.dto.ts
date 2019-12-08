import { ApiModelProperty } from '@nestjs/swagger';

export class SubscriptionInfoDto {
  @ApiModelProperty()
  isActive!: boolean;

  @ApiModelProperty({ type: String, format: 'date-time' })
  activeFrom!: Date;

  @ApiModelProperty({ type: String, format: 'date-time' })
  activeTo!: Date;
}
