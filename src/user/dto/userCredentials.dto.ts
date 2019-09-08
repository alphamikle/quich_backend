import { ApiModelProperty } from '@nestjs/swagger';

export class UserCredentialsDTO {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  password: string;
}
