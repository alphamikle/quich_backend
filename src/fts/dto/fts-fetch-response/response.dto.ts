import { ApiModelProperty } from '@nestjs/swagger';
import { FtsFetchResponseDocument } from './document.dto';
import { AxiosResponse } from 'axios';

export class FtsFetchResponse {
  @ApiModelProperty()
  data: FtsFetchResponseDocument;
  status: number;
}
