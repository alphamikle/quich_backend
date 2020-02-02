import { Logger } from '@nestjs/common';
import * as assert from 'assert';
import { FtsQrDto } from '../../fts/dto/fts-qr.dto';
import { BaseOfdFetcher, FetcherParams } from '../base-ofd-fetcher';
import { FetchResponse, Item } from './interfaces';
import { BillDto } from '../../bill/dto/bill.dto';
import { DateHelper } from '../../helpers/date.helper';
import { ShopDto } from '../../shop/dto/shop.dto';
import { PurchaseDto } from '../../purchase/dto/purchase.dto';
import { ProxyService } from '../../proxy/proxy.service';

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

  private readonly proxyService: ProxyService;

  private readonly checkBillUrl = 'https://consumer.1-ofd.ru/api/tickets/find-ticket';

  private readonly fetchBillUrl = 'https://consumer.1-ofd.ru/api/tickets/ticket/';

  private checkResponse: FirstOfdCheckBillResponse = null;

  private fetchResponse: FetchResponse = null;

  constructor(qrDto: FtsQrDto, { dateHelper, proxyService }: FetcherParams) {
    super(qrDto, '1-OFD');
    assert(dateHelper !== undefined);
    assert(proxyService !== undefined);
    this.dateHelper = dateHelper;
    this.proxyService = proxyService;
  }

  public async fetchBill(): Promise<BillDto> {
    await this.getRawData();
    await this.getBillData();
    return this.transformFetcherDataToBillData();
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

  private async getRawData(): Promise<void> {
    try {
      const { data } = await this.proxyService.request<FirstOfdCheckBillResponse>({
        url: this.checkBillUrl,
        data: {
          fiscalDriveId: this.fiscalNumber,
          fiscalDocumentNumber: this.fiscalDocument,
          fiscalId: this.fiscalProp,
        }
      });
      if (data.status === FirstOfdCheckBillStatus.NOT_EXIST) {
        this.notFound();
      }
      this.checkResponse = data;
    } catch (err) {
      this.notFound();
    }
  }

  private async getBillData() {
    if (this.checkResponse !== null) {
      try {
        const response = await this.proxyService.request<FetchResponse>({
          url: this.fetchBillUrl + this.checkResponse.uid,
          method: 'GET',
        });
        this.fetchResponse = response.data;
      } catch (err) {
        Logger.error(err.message, null, `${ FirstOfdFetcher.name }:getBillData`);
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
}
