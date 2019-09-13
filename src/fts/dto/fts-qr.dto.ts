import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class FtsQrDto {
  @ApiModelProperty()
  fiscalNumber!: string;

  @ApiModelProperty()
  fiscalProp!: string;

  @ApiModelProperty()
  fiscalDocument!: string;

  @ApiModelProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  dateTime?: Date;

  @ApiModelProperty()
  totalSum?: number; // ? Используется не для всех запросов

  @ApiModelProperty({ type: 'integer' })
  checkType?: number;
}
