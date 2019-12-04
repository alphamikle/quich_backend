import { ApiModelProperty } from '@nestjs/swagger';

export class UserPurchaseAssignDto {
  @ApiModelProperty()
  purchaseToken: string;
}
