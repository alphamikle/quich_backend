import { Metadata } from 'grpc';
/* eslint-disable */
import { Bill } from './export';
import { ShopDto } from './shop';
import { PurchaseDto } from './purchase';
import { Empty } from './google/protobuf/empty';


export interface Bills {
  bills: Bill[];
}

export interface BillDto {
  billId?: string;
  shopDto?: ShopDto;
  billDate?: Date;
  date?: string;
  time?: string;
  comment?: string;
  totalSum: number;
  purchases: PurchaseDto[];
  billRequestId?: string;
  providerCode?: ProviderCode;
}

export interface FtsQrDto {
  fiscalNumber: string;
  fiscalProp: string;
  fiscalDocument: string;
  ftsDateTime: string;
  totalSum: number;
}

export interface RequestIdDto {
  requestId: string;
}

export interface BillIdDto {
  billId: string;
}

export interface BillController {

  getUserBills(request: Empty, meta: Metadata): Promise<Bills>;

  getBillData(request: FtsQrDto, meta: Metadata): Promise<BillDto>;

  getBillDataByBillRequestId(request: RequestIdDto, meta: Metadata): Promise<BillDto>;

  createBill(request: BillDto, meta: Metadata): Promise<Bill>;

  editBill(request: BillDto, meta: Metadata): Promise<Bill>;

  deleteBill(request: BillIdDto, meta: Metadata): Promise<Empty>;

}

export const ProviderCode = {
  FTS: 0 as const,
  FIRST_OFD: 1 as const,
  OFD: 2 as const,
  TAXCOM: 3 as const,
  UNRECOGNIZED: -1 as const,
}

export type ProviderCode = 0 | 1 | 2 | 3 | -1;
