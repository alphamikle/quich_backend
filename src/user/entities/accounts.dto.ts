import { FtsAccount } from '~/user/entities/fts-account.entity';
import * as fts from '~/proto-generated/fts';

export class Accounts implements fts.Accounts {
  constructor(public accounts: FtsAccount[]) {
  }
}