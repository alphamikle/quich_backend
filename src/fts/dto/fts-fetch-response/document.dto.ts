import { ApiModelProperty }        from '@nestjs/swagger';
import { FtsFetchResponseReceipt } from './receipt.dto';

export class FtsFetchResponseDocument {
  @ApiModelProperty()
  document: FtsFetchResponseReceipt;
}
