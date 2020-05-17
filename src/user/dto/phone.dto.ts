import * as user from '~/proto-generated/user';

export class PhoneDto implements user.PhoneDto {
  phone!: string;
}