import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ShopDto }                                    from '../../shop/dto/shop.dto';
import { PurchaseDto }                                from '../../purchase/dto/purchase.dto';

export class BillDto {
  @ApiModelPropertyOptional()
  id?: string;

  @ApiModelProperty()
  shop!: ShopDto;

  @ApiModelProperty({
    type: String,
    format: 'date-time',
  })
  billDate!: Date;

  @ApiModelPropertyOptional()
  date?: string;

  @ApiModelPropertyOptional()
  time?: string;

  @ApiModelProperty()
  comment?: string;

  @ApiModelProperty({ format: 'double' })
  totalSum!: number;

  @ApiModelProperty({ type: [PurchaseDto] })
  purchases!: PurchaseDto[];

  @ApiModelPropertyOptional({ default: false })
  isValid?: boolean;

  @ApiModelPropertyOptional({ default: false })
  isPurchasesValid?: boolean;

  @ApiModelPropertyOptional()
  billRequestId?: string;

  providerCode?: string;
}
