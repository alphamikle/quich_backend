import { ApiModelProperty } from '@nestjs/swagger';

export class FtsRegistrationDto {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  phone: string;

  @ApiModelProperty()
  name: string;

  constructor({ email, phone, name }: { email: string, phone: string, name?: string }) {
    this.email = email;
    this.phone = phone;
    if (!name) {
      this.name = email.split('@')[ 0 ];
    } else {
      this.name = name;
    }
  }
}
