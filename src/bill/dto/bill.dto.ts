import { ShopDto } from '../../shop/dto/shop.dto';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { PurchaseDto } from '../../purchase/dto/purchase.dto';

export class BillDto {
  @ApiModelPropertyOptional()
  id?: string;
  @ApiModelProperty()
  shop!: ShopDto;
  @ApiModelProperty({ type: String, format: 'date-time' })
  billDate!: Date;
  @ApiModelProperty()
  comment?: string;
  @ApiModelProperty({ format: 'double' })
  totalSum!: number;
  @ApiModelProperty({ type: [PurchaseDto] })
  purchases!: PurchaseDto[];
  providerCode?: string;
}
