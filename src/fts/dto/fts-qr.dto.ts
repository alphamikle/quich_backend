import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class FtsQrDto {
  @ApiModelProperty()
  fiscalNumber!: string;

  @ApiModelProperty()
  fiscalProp!: string;

  @ApiModelProperty()
  fiscalDocument!: string;

  @ApiModelProperty()
  dateTime?: string;

  @ApiModelPropertyOptional({ format: 'double' })
  totalSum?: number; // ? Используется не для всех запросов

  @ApiModelProperty({ type: 'integer', example: 1 })
  checkType?: number;
}
