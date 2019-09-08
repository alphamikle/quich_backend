import { ApiModelProperty } from '@nestjs/swagger';

export class FtsAccountDto {
  @ApiModelProperty()
  phone!: string;

  @ApiModelProperty()
  password!: string;
}
