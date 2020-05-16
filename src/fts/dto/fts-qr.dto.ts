import * as bill from '~/proto-generated/bill';

export class FtsQrDto implements bill.FtsQrDto {

  fiscalNumber!: string;

  fiscalProp!: string;

  fiscalDocument!: string;

  ftsDateTime!: string;

  totalSum!: number; // ? Используется не для всех запросов

  checkType?: number;
}
