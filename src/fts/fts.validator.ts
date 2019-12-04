import { Injectable } from '@nestjs/common';
import { FtsService } from './fts.service';
import { FtsAccountDto } from './dto/fts-account.dto';
import { FtsRegistrationDto } from './dto/fts-registration.dto';
import { CommonValidator } from '../helpers/common.validator';
import { BAD_FTS_SIGN_IN_DATA, NOT_EMPTY_ERROR } from '../helpers/text';
import { FtsRemindDto } from './dto/fts-remind.dto';

@Injectable()
export class FtsValidator {
  constructor(
    private readonly ftsService: FtsService,
    private readonly commonValidator: CommonValidator,
  ) {
  }

  async isSignInDataValid(signInCredentials: FtsAccountDto): Promise<boolean> {
    return this.ftsService.signIn(signInCredentials);
  }

  validateRegistrationDto({ phone, name, email }: FtsRegistrationDto): { phone: string; name: string; email: string } | true {
    const errors = {
      phone: '',
      name: '',
      email: '',
    };
    const phoneValidation = this.commonValidator.validatePhone(phone);
    if (phoneValidation !== true) {
      errors.phone = phoneValidation;
    }
    const emailValidation = this.commonValidator.validateEmail(email);
    if (emailValidation !== true) {
      errors.email = emailValidation;
    }
    if (this.commonValidator.isEmpty(name)) {
      errors.name = NOT_EMPTY_ERROR;
    }
    if (!this.commonValidator.isErrorsEmpty(errors)) {
      return errors;
    }
    return true;
  }

  async validateFtsAccountDto({ phone, password }: FtsAccountDto): Promise<true | { password: string; phone: string }> {
    const errors = {
      phone: '',
      password: '',
    };
    const phoneValidation = this.commonValidator.validatePhone(phone);
    if (phoneValidation !== true) {
      errors.phone = phoneValidation;
      return errors;
    }
    const isSignInDataValid = await this.isSignInDataValid({ phone, password });
    if (!isSignInDataValid) {
      errors.password = BAD_FTS_SIGN_IN_DATA;
      errors.phone = BAD_FTS_SIGN_IN_DATA;
    }
    if (this.commonValidator.isErrorsEmpty(errors)) {
      return true;
    }
    return errors;
  }

  validateRemindDto({ phone }: FtsRemindDto): true | { phone: string } {
    const errors = {
      phone: '',
    };
    const validationResult = this.commonValidator.validatePhone(phone);
    if (validationResult !== true) {
      errors.phone = validationResult;
      return errors;
    }
    return true;
  }

}
