import { ApiModelProperty } from '@nestjs/swagger';

export class FtsAccountDto {
  @ApiModelProperty()
  phone!: string;
  @ApiModelProperty()
  password!: string;

  constructor(phone: string, password: string) {
    this.password = password;
    this.phone = phone;
  }
}
