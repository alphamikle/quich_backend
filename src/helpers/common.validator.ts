import { Injectable } from '@nestjs/common';
import { INVALID_EMAIL_ERROR, INVALID_PHONE_ERROR, NOT_EMPTY_ERROR } from './text';

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

  validatePhone(phone: string): string | true {
    if (this.isEmpty(phone)) {
      return NOT_EMPTY_ERROR;
    } else if (!this.isPhone(phone)) {
      return INVALID_PHONE_ERROR;
    }
    return true;
  }

  validateEmail(email: string): string | true {
    if (this.isEmpty(email)) {
      return NOT_EMPTY_ERROR;
    } else if (!this.isEmail(email)) {
      return INVALID_EMAIL_ERROR;
    }
    return true;
  }

  isErrorsEmpty(errors: { [ field: string ]: string }): boolean {
    return Object.values(errors).filter(value => !this.isEmpty(value)).length === 0;
  }
}
