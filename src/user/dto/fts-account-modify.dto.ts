import { ApiModelProperty } from '@nestjs/swagger';

export class FtsAccountModifyDto {
  @ApiModelProperty()
  password!: string;

  @ApiModelProperty()
  phone!: string;
}
