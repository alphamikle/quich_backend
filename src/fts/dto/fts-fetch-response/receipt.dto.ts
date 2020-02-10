import { ApiModelProperty }     from '@nestjs/swagger';
import { FtsFetchResponseBill } from './bill.dto';

export class FtsFetchResponseReceipt {
  @ApiModelProperty()
  receipt: FtsFetchResponseBill;
}
