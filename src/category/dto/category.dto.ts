import { ApiModelProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiModelProperty()
  id?: string;
  @ApiModelProperty()
  title!: string;
  @ApiModelProperty()
  color!: number;
}
