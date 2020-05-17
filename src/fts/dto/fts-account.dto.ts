import * as user from '~/proto-generated/user';

export class FtsAccountDto implements user.FtsAccountDto {

  phone!: string;

  password!: string;

  constructor(phone: string, password: string) {
    this.password = password;
    this.phone = phone;
  }
}
