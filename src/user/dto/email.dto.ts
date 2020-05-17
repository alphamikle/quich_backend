import * as user from '~/proto-generated/user';

export class EmailDto implements user.EmailDto {
  email!: string;
}