import { ApiModelProperty } from '@nestjs/swagger';

export class FtsFetchResponsePurchase {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  sum: number;
  @ApiModelProperty()
  price: number;
  @ApiModelProperty()
  quantity: number;
}
