import * as user from '~/protobuf/generated/user';

export class SignInResponse implements user.SignInResponse {
  token!: string;
}