import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { FtsFetchResponseBill }                       from '../../fts/dto/fts-fetch-response/bill.dto';

export class BillRequestCreatingDto {
  @ApiModelProperty()
  fiscalProp!: string;

  @ApiModelProperty()
  fiscalNumber!: string;

  @ApiModelProperty()
  fiscalDocument!: string;

  @ApiModelProperty({
    type: String,
    format: 'date-time',
  })
  billDate!: Date;

  @ApiModelProperty({ format: 'double' })
  totalSum!: number;

  @ApiModelPropertyOptional()
  rawData?: FtsFetchResponseBill;

  @ApiModelProperty()
  isFetched?: boolean;

  @ApiModelProperty()
  userId!: string;
}
