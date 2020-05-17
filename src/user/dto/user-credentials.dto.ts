import * as user from '~/proto-generated/user';

export class UserCredentialsDto implements user.UserCredentialsDto {

  email: string;

  password: string;
}
