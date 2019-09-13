import { ApiModelProperty } from '@nestjs/swagger';
import { FtsFetchResponseBill } from '../../fts/dto/fts-fetch-response/bill.dto';

export class BillRequestCreatingDto {
  @ApiModelProperty()
  fiscalProp!: string;

  @ApiModelProperty()
  fiscalNumber!: string;

  @ApiModelProperty()
  fiscalDocument!: string;

  @ApiModelProperty({ type: Date })
  billDate!: Date;

  @ApiModelProperty()
  totalSum!: number;

  @ApiModelProperty()
  rawData?: FtsFetchResponseBill;

  @ApiModelProperty()
  isFetched?: boolean;

  @ApiModelProperty()
  userId!: string;
}
