import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonValidator {
  isEmail(email: string): boolean {
    // tslint:disable-next-line:max-line-length
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegEx.test(email);
  }

  isEmpty(value: string) {
    return value === null || value === undefined || value === '' || value.trim() === '';
  }

  isPhone(phone: string) {
    return /((^\+7)|(^8)|(^7))9[0-9]{9}$/.test(phone);
  }

  isErrorsEmpty(errors: { [field: string]: string }): boolean {
    return Object.values(errors).filter(value => !this.isEmpty(value)).length === 0;
  }
}
