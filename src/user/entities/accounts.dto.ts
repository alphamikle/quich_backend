import { FtsAccount } from '~/user/entities/fts-account.entity';
import * as user from '~/proto-generated/user';

export class Accounts implements user.Accounts {
  constructor(public accounts: FtsAccount[]) {
  }
}