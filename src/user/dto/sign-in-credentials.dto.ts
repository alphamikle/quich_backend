import * as user from '~/protobuf/generated/user';
import { localeIsEmail, localeIsNotEmpty, localeIsTooShort } from '~/providers/decorators';

export class SignInCredentials implements user.SignInCredentials {
  @localeIsEmail
  @localeIsNotEmpty
  email!: string;

  @localeIsTooShort
  password!: string;
}