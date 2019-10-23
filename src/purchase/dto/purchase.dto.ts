import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class PurchaseDto {
  @ApiModelPropertyOptional()
  id?: string;
  @ApiModelProperty()
  title!: string;
  @ApiModelProperty({ format: 'double' })
  price!: number;
  @ApiModelProperty({ format: 'double' })
  quantity!: number;
  @ApiModelPropertyOptional({ format: 'double' })
  rate?: number;
  @ApiModelPropertyOptional()
  categoryId?: string;
  @ApiModelPropertyOptional({ default: false })
  isValid?: boolean;
}
