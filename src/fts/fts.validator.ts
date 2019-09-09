import { Injectable } from '@nestjs/common';
import { FtsService } from './fts.service';
import { FtsAccountDto } from './dto/fts-account.dto';
import { FtsRegistrationDto } from './dto/fts-registration.dto';
import { CommonValidator } from '../helpers/common.validator';
import { INVALID_EMAIL_ERROR, INVALID_PHONE_ERROR, NOT_EMPTY_ERROR } from '../helpers/text';
import { FtsRemindDto } from './dto/fts-remind.dto';

@Injectable()
export class FtsValidator {
  constructor(
    private readonly ftsService: FtsService,
    private readonly commonValidator: CommonValidator,
  ) {
  }

  async isSignInDataValid(signInCredentials: FtsAccountDto): Promise<boolean> {
    return await this.ftsService.signIn(signInCredentials);
  }

  validateRegistrationDto({ phone, name, email }: FtsRegistrationDto): { phone: string; name: string; email: string } | true {
    const errors = {
      phone: '',
      name: '',
      email: '',
    };
    if (this.commonValidator.isEmpty(phone)) {
      errors.phone = NOT_EMPTY_ERROR;
    } else if (!this.commonValidator.isPhone(phone)) {
      errors.phone = INVALID_PHONE_ERROR;
    }
    if (this.commonValidator.isEmpty(email)) {
      errors.email = NOT_EMPTY_ERROR;
    } else if (!this.commonValidator.isEmail(email)) {
      errors.email = INVALID_EMAIL_ERROR;
    }
    if (this.commonValidator.isEmpty(name)) {
      errors.name = NOT_EMPTY_ERROR;
    }
    if (!this.commonValidator.isErrorsEmpty(errors)) {
      return errors;
    }
    return true;
  }

  validateRemindDto({ phone }: FtsRemindDto): true | { phone: string } {
    const errors = {
      phone: '',
    };
    if (this.commonValidator.isEmpty(phone)) {
      errors.phone = NOT_EMPTY_ERROR;
    } else if (!this.commonValidator.isPhone(phone)) {
      errors.phone = INVALID_PHONE_ERROR;
    }
    if (!this.commonValidator.isErrorsEmpty(errors)) {
      return errors;
    }
    return true;
  }

}
