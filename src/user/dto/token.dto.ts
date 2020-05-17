import * as user from '~/proto-generated/user';

export class TokenDto implements user.TokenDto {
  constructor(public token: string) {
  }
}