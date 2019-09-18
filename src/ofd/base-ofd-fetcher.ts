import { BillDto } from '../bill/dto/bill.dto';
import { FtsQrDto } from '../fts/dto/fts-qr.dto';

export abstract class BaseOfdFetcher {
  protected fiscalDocument: string;
  protected fiscalProp: string;
  protected fiscalNumber: string;
  protected bill: BillDto = new BillDto();

  protected constructor({ fiscalDocument, fiscalProp, fiscalNumber }: FtsQrDto, code: string) {
    this.fiscalDocument = fiscalDocument;
    this.fiscalProp = fiscalProp;
    this.fiscalNumber = fiscalNumber;
    this.bill.providerCode = code;
  }

  public abstract async fetchBill(): Promise<BillDto>;
}
