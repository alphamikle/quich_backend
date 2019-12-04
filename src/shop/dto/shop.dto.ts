import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class ShopDto {
  @ApiModelPropertyOptional()
  id?: string;

  @ApiModelProperty()
  title!: string;

  @ApiModelProperty()
  tin!: string;

  @ApiModelProperty()
  address!: string;
}
