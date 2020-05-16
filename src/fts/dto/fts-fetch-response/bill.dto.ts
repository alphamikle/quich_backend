import { FtsFetchResponsePurchase } from './purchase.dto';

export class FtsFetchResponseBill {

  senderAddress?: string;


  dateTime: string;


  requestNumber?: number;


  rawData?: string;


  fiscalDocumentNumber?: number;


  items: FtsFetchResponsePurchase[];


  receiptCode?: number;


  kktRegId?: string;


  shiftNumber?: number;


  taxationType?: number;


  user: string;


  fiscalSign?: number;


  operator?: string;


  nds18?: number;


  retailPlaceAddress?: string;


  retailAddress?: string;


  addressToCheckFiscalSign?: string;


  totalSum: number;


  userInn: string;


  nds10?: number;


  operationType?: number;


  cashTotalSum?: number;


  buyerAddress?: string;


  ecashTotalSum?: number;


  fiscalDriveNumber?: string;


  retailPlace?: string;
}
