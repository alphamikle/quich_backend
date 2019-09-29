import { ApiModelProperty } from '@nestjs/swagger';

export class PurchaseDto {
  @ApiModelProperty()
  id?: string;
  @ApiModelProperty()
  title!: string;
  @ApiModelProperty()
  price!: number;
  @ApiModelProperty()
  quantity!: number;
  @ApiModelProperty()
  rate?: number;
  @ApiModelProperty()
  categoryId?: string;
}
