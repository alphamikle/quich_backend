import { ApiModelProperty } from '@nestjs/swagger';
import { FtsFetchResponsePurchase } from './purchase.dto';

export class FtsFetchResponseBill {
  @ApiModelProperty()
  senderAddress?: string;
  @ApiModelProperty()
  dateTime: string;
  @ApiModelProperty()
  requestNumber?: number;
  @ApiModelProperty()
  rawData?: string;
  @ApiModelProperty()
  fiscalDocumentNumber?: number;
  @ApiModelProperty()
  items: FtsFetchResponsePurchase[];
  @ApiModelProperty()
  receiptCode?: number;
  @ApiModelProperty()
  kktRegId?: string;
  @ApiModelProperty()
  shiftNumber?: number;
  @ApiModelProperty()
  taxationType?: number;
  @ApiModelProperty()
  user: string;
  @ApiModelProperty()
  fiscalSign?: number;
  @ApiModelProperty()
  operator?: string;
  @ApiModelProperty()
  nds18?: number;
  @ApiModelProperty()
  retailPlaceAddress: string;
  @ApiModelProperty()
  addressToCheckFiscalSign?: string;
  @ApiModelProperty()
  totalSum: number;
  @ApiModelProperty()
  userInn: string;
  @ApiModelProperty()
  nds10?: number;
  @ApiModelProperty()
  operationType?: number;
  @ApiModelProperty()
  cashTotalSum?: number;
  @ApiModelProperty()
  buyerAddress?: string;
  @ApiModelProperty()
  ecashTotalSum?: number;
  @ApiModelProperty()
  fiscalDriveNumber?: string;
  @ApiModelProperty()
  retailPlace?: string;
}
