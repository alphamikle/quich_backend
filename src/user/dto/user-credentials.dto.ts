import { ApiModelProperty } from '@nestjs/swagger';

export class UserCredentialsDto {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty({ format: 'password' })
  password: string;
}
