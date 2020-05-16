import { FtsFetchResponseBill } from '../../fts/dto/fts-fetch-response/bill.dto';

export class BillRequestCreatingDto {

  fiscalProp!: string;


  fiscalNumber!: string;


  fiscalDocument!: string;

  billDate!: Date;


  totalSum!: number;


  rawData?: FtsFetchResponseBill;


  isFetched?: boolean;


  userId!: string;
}
