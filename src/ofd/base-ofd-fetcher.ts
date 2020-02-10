import { Logger }         from '@nestjs/common';
import { HTMLElement }    from 'node-html-parser';
import { BillDto }        from '../bill/dto/bill.dto';
import { FtsQrDto }       from '../fts/dto/fts-qr.dto';
import { ShopDto }        from '../shop/dto/shop.dto';
import { PurchaseDto }    from '../purchase/dto/purchase.dto';
import { Item }           from './1-ofd.ru/interfaces';
import { DateHelper }     from '../helpers/date.helper';
import { RequestService } from '../proxy/dto/requestable.interface';

export interface FetcherParams {
  dateHelper?: DateHelper;
  proxyService?: RequestService;
}

export type OfdFetcherClass = { new(qrDto: FtsQrDto, params?: FetcherParams): BaseOfdFetcher };

export type PurchaseData = Item | HTMLElement;

export abstract class BaseOfdFetcher {
  protected fiscalDocument: string;

  protected fiscalProp: string;

  protected fiscalNumber: string;

  protected bill: BillDto = new BillDto();

  protected qrDto: FtsQrDto;

  protected qrDtoString: string;

  protected constructor(qrDto: FtsQrDto, code: string) {
    const { fiscalDocument, fiscalProp, fiscalNumber } = qrDto;
    this.qrDto = qrDto;
    this.qrDtoString = JSON.stringify(this.qrDto);
    this.fiscalDocument = fiscalDocument;
    this.fiscalProp = fiscalProp;
    this.fiscalNumber = fiscalNumber;
    this.bill.providerCode = code;
  }

  public abstract async fetchBill(): Promise<BillDto>;

  protected abstract getShop(): ShopDto;

  protected abstract getPurchases(): PurchaseDto[];

  protected abstract getPurchase(purchaseData?: PurchaseData): PurchaseDto;

  protected notFound() {
    Logger.warn(`Not found data of bill with qrDto=${this.qrDtoString} in ${this.constructor.name}`, this.constructor.name);
  }

  protected found() {
    Logger.log(`Found bill data with qrDto=${this.qrDtoString} in ${this.constructor.name}`, this.constructor.name);
  }
}
