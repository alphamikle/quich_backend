import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { FtsFetchResponsePurchase } from './purchase.dto';

export class FtsFetchResponseBill {
  @ApiModelPropertyOptional()
  senderAddress?: string;
  @ApiModelProperty()
  dateTime: string;
  @ApiModelPropertyOptional()
  requestNumber?: number;
  @ApiModelPropertyOptional()
  rawData?: string;
  @ApiModelPropertyOptional()
  fiscalDocumentNumber?: number;
  @ApiModelProperty()
  items: FtsFetchResponsePurchase[];
  @ApiModelPropertyOptional()
  receiptCode?: number;
  @ApiModelPropertyOptional()
  kktRegId?: string;
  @ApiModelPropertyOptional()
  shiftNumber?: number;
  @ApiModelPropertyOptional()
  taxationType?: number;
  @ApiModelProperty()
  user: string;
  @ApiModelPropertyOptional()
  fiscalSign?: number;
  @ApiModelPropertyOptional()
  operator?: string;
  @ApiModelPropertyOptional()
  nds18?: number;
  @ApiModelPropertyOptional()
  retailPlaceAddress?: string;
  @ApiModelPropertyOptional()
  retailAddress?: string;
  @ApiModelPropertyOptional()
  addressToCheckFiscalSign?: string;
  @ApiModelProperty()
  totalSum: number;
  @ApiModelProperty()
  userInn: string;
  @ApiModelPropertyOptional()
  nds10?: number;
  @ApiModelProperty()
  operationType?: number;
  @ApiModelPropertyOptional()
  cashTotalSum?: number;
  @ApiModelPropertyOptional()
  buyerAddress?: string;
  @ApiModelPropertyOptional()
  ecashTotalSum?: number;
  @ApiModelPropertyOptional()
  fiscalDriveNumber?: string;
  @ApiModelPropertyOptional()
  retailPlace?: string;
}
