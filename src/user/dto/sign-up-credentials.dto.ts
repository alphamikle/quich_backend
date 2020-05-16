import 'reflect-metadata';
import * as user from '~/protobuf/generated/user';
import { FileData } from '~/file/dto/file-data.dto';
import { localeArrayIsNotEmpty, localeIsEmail, localeIsMobilePhone, localeIsNotEmpty, localeIsTooShort } from '~/providers/decorators';

export class SignUpCredentials implements user.SignUpCredentials {
  @localeIsNotEmpty
  @localeIsEmail
  email!: string;

  @localeIsNotEmpty
  @localeIsMobilePhone
  phone!: string;

  @localeIsTooShort
  password!: string;

  @localeIsNotEmpty
  @localeIsNotEmpty
  company!: string;

  @localeIsNotEmpty
  name!: string;

  @localeIsNotEmpty
  family!: string;

  @localeArrayIsNotEmpty
  activityCategories!: string[];

  @localeIsNotEmpty
  photo!: FileData;
}
