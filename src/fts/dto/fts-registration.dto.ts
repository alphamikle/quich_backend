export class FtsRegistrationDto {

  email!: string;


  phone!: string;


  name!: string;

  constructor({ email, phone, name }: { email: string, phone: string, name?: string }) {
    this.email = email;
    this.phone = phone;
    if (!name) {
      this.name = email.split('@')[0];
    } else {
      this.name = name;
    }
  }
}
