import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { FtsFetchResponsePurchase } from './purchase.dto';

export class FtsFetchResponseBill {
  @ApiModelPropertyOptional()
  senderAddress?: string;
  @ApiModelProperty()
  dateTime: string;
  @ApiModelPropertyOptional({ type: 'integer' })
  requestNumber?: number;
  @ApiModelPropertyOptional()
  rawData?: string;
  @ApiModelPropertyOptional()
  fiscalDocumentNumber?: number;
  @ApiModelProperty()
  items: FtsFetchResponsePurchase[];
  @ApiModelPropertyOptional({ type: 'integer' })
  receiptCode?: number;
  @ApiModelPropertyOptional()
  kktRegId?: string;
  @ApiModelPropertyOptional({ type: 'integer' })
  shiftNumber?: number;
  @ApiModelPropertyOptional({ type: 'integer' })
  taxationType?: number;
  @ApiModelProperty()
  user: string;
  @ApiModelPropertyOptional({ type: 'integer' })
  fiscalSign?: number;
  @ApiModelPropertyOptional()
  operator?: string;
  @ApiModelPropertyOptional({ format: 'double' })
  nds18?: number;
  @ApiModelPropertyOptional()
  retailPlaceAddress?: string;
  @ApiModelPropertyOptional()
  retailAddress?: string;
  @ApiModelPropertyOptional()
  addressToCheckFiscalSign?: string;
  @ApiModelProperty({ format: 'double' })
  totalSum: number;
  @ApiModelProperty()
  userInn: string;
  @ApiModelPropertyOptional({ format: 'double' })
  nds10?: number;
  @ApiModelProperty({ type: 'integer' })
  operationType?: number;
  @ApiModelPropertyOptional({ format: 'double' })
  cashTotalSum?: number;
  @ApiModelPropertyOptional()
  buyerAddress?: string;
  @ApiModelPropertyOptional({ format: 'double' })
  ecashTotalSum?: number;
  @ApiModelPropertyOptional()
  fiscalDriveNumber?: string;
  @ApiModelPropertyOptional()
  retailPlace?: string;
}
