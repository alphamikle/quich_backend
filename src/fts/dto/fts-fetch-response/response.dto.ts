import { ApiModelProperty } from '@nestjs/swagger';
import { FtsFetchResponseDocument } from './document.dto';

export class FtsFetchResponse {
  @ApiModelProperty()
  data: FtsFetchResponseDocument;
  @ApiModelProperty()
  status: number;
}
