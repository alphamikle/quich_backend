import { Bill } from '~/bill/entities/bill.entity';
import * as bill from '~/proto-generated/bill';

export class Bills implements bill.Bills {
  constructor(public readonly bills: Bill[]) {
  }
}