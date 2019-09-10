import { ApiModelProperty } from '@nestjs/swagger';

export class FtsAccountDto {
  constructor(phone: string, password: string) {
    this.password = password;
    this.phone = phone;
  }
  @ApiModelProperty()
  phone!: string;

  @ApiModelProperty()
  password!: string;
}
