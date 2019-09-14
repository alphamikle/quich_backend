import { ShopDto } from '../../shop/dto/shop.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { PurchaseDto } from '../../purchase/dto/purchase.dto';

export class BillDto {
  @ApiModelProperty()
  shop!: ShopDto;
  @ApiModelProperty()
  billDate!: Date;
  @ApiModelProperty()
  comment?: string;
  @ApiModelProperty()
  totalSum!: number;
  @ApiModelProperty()
  purchases!: PurchaseDto[];
}
