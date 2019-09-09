import { ApiModelProperty } from '@nestjs/swagger';

export class FtsRemindDto {
  @ApiModelProperty()
  phone!: string;
}
