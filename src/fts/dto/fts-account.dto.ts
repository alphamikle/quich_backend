export class FtsAccountDto {

  phone!: string;


  password!: string;

  constructor(phone: string, password: string) {
    this.password = password;
    this.phone = phone;
  }
}
