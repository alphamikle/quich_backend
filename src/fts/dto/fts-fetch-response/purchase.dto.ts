import { ApiModelProperty } from '@nestjs/swagger';

export class FtsFetchResponsePurchase {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty({ format: 'double' })
  sum: number;
  @ApiModelProperty({ format: 'double' })
  price: number;
  @ApiModelProperty({ format: 'double' })
  quantity: number;
}
