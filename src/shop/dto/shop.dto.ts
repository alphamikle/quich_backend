import { ApiModelProperty } from '@nestjs/swagger';

export class ShopDto {
  @ApiModelProperty()
  id?: string;
  @ApiModelProperty()
  title!: string;
  @ApiModelProperty()
  tin!: string;
  @ApiModelProperty()
  address!: string;
}
