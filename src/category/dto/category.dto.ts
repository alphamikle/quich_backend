import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CategoryDto {
  @ApiModelPropertyOptional()
  id?: string;

  @ApiModelProperty()
  title!: string;

  @ApiModelProperty({ type: 'integer' })
  color!: number;
}
