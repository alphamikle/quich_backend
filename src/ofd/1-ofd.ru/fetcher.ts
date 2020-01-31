import axios from 'axios';
import { Logger } from '@nestjs/common';
import { FtsQrDto } from '../../fts/dto/fts-qr.dto';
import { BaseOfdFetcher } from '../base-ofd-fetcher';
import { fetchError } from '../fetcher-error';
import { FetchResponse, Item } from './interfaces';
import { BillDto } from '../../bill/dto/bill.dto';
import { DateHelper } from '../../helpers/date.helper';
import { ShopDto } from '../../shop/dto/shop.dto';
import { PurchaseDto } from '../../purchase/dto/purchase.dto';

export enum FirstOfdCheckBillStatus {
  EXIST = 1,
  NOT_EXIST
}

export interface FirstOfdCheckBillResponse {
  uid: string;
  status: FirstOfdCheckBillStatus;
}

export class FirstOfdFetcher extends BaseOfdFetcher {
  private readonly dateHelper: DateHelper;

  private readonly checkBillUrl = 'https://consumer.1-ofd.ru/api/tickets/find-ticket';

  private readonly fetchBillUrl = 'https://consumer.1-ofd.ru/api/tickets/ticket/';

  private checkResponse: FirstOfdCheckBillResponse = null;

  private fetchResponse: FetchResponse = null;

  constructor(qrDto: FtsQrDto, dateHelper: DateHelper) {
    super(qrDto, '1-OFD');
    this.dateHelper = dateHelper;
  }

  public async fetchBill(): Promise<BillDto> {
    await this.getRawData();
    await this.getBillData();
    return this.transformFetcherDataToBillData();
  }

  private async getRawData(): Promise<void> {
    try {
      const { data } = await axios.post<FirstOfdCheckBillResponse>(this.checkBillUrl, {
        fiscalDriveId: this.fiscalNumber,
        fiscalDocumentNumber: this.fiscalDocument,
        fiscalId: this.fiscalProp,
      });
      if (data.status === FirstOfdCheckBillStatus.NOT_EXIST) {
        this.notFound();
      }
      this.checkResponse = data;
    } catch (err) {
      fetchError(FirstOfdFetcher, err.message);
      this.notFound();
    }
  }

  private async getBillData() {
    if (this.checkResponse !== null) {
      try {
        const response = await axios.get<FetchResponse>(this.fetchBillUrl + this.checkResponse.uid);
        this.fetchResponse = response.data;
      } catch (err) {
        Logger.error(err.message);
      }
    }
  }

  private transformFetcherDataToBillData(): BillDto {
    if (this.fetchResponse !== null) {
      const fr = this.fetchResponse;
      this.bill.billDate = this.dateHelper.parse(fr.ticket?.transactionDate);
      this.bill.shop = this.getShop();
      this.bill.purchases = this.getPurchases();
      return this.bill;
    }
    return null;
  }

  protected getShop(): ShopDto {
    const shop = new ShopDto();
    shop.tin = this.fetchResponse.ticket.userInn.trim();
    shop.address = this.fetchResponse.retailPlaceAddress;
    shop.title = this.fetchResponse.orgTitle;
    return shop;
  }

  protected getPurchases(): PurchaseDto[] {
    const purchases: PurchaseDto[] = [];
    const purchasesData = this.fetchResponse.ticket.items;
    for (const purchaseData of purchasesData) {
      purchases.push(this.getPurchase(purchaseData));
    }
    return purchases;
  }

  protected getPurchase(item: Item): PurchaseDto {
    const purchase = new PurchaseDto();
    purchase.price = item.price / 100;
    purchase.quantity = item.quantity;
    purchase.title = item.name;
    this.bill.totalSum += purchase.price * purchase.quantity;
    return purchase;
  }
}
