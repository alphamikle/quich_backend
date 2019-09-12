import { ApiModelProperty } from '@nestjs/swagger';

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
  rawData?: JSON;

  @ApiModelProperty()
  isFetched?: boolean;

  @ApiModelProperty()
  userId!: string;
}
