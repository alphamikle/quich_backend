import { ApiModelProperty } from '@nestjs/swagger';

export class FtsAccountModifyDto {
  @ApiModelProperty()
  isMain!: boolean;

  @ApiModelProperty()
  password!: string;

  @ApiModelProperty()
  phone!: string;
}
