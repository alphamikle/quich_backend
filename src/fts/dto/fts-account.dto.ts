import * as fts from '~/proto-generated/fts';

export class FtsAccountDto implements fts.FtsAccountDto {

  phone!: string;

  password!: string;

  constructor(phone: string, password: string) {
    this.password = password;
    this.phone = phone;
  }
}
