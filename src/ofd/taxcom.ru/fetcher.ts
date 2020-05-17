import { HTMLElement, parse } from 'node-html-parser';
import { Logger } from '@nestjs/common';
import { BaseOfdFetcher, FetcherParams } from '~/ofd/base-ofd-fetcher';
import { PurchaseDto } from '~/purchase/dto/purchase.dto';
import { ShopDto } from '~/shop/dto/shop.dto';
import { FtsQrDto } from '~/fts/dto/fts-qr.dto';
import { RequestService } from '~/proxy/dto/requestable.interface';
import { decodeHtmlEntities } from '~/helpers/common.helper';
import { BillDto } from '~/bill/dto/bill.dto';
import { DateHelper } from '~/helpers/date.helper';
import { ProviderCode } from '~/bill-provider/entities/bill-provider.entity';

export class TaxcomFetcher extends BaseOfdFetcher {

  private getUrl(): string {
    return `https://receipt.taxcom.ru/v01/show?fp=${ this.qrDto.fiscalProp }&s=${ this.qrDto.totalSum.toString() }&sf=False&sfn=False`;
  }

  private readonly dateHelper: DateHelper;

  private shopTitleSelector = '.receipt-header1-appeal.receipt-content-width .receipt-subtitle b';

  private shopDataSelector = '.receipt-row-1.receipt-company-name';

  private productsSelector = '.items';

  private proxyService: RequestService;

  private rawData: string;

  private html: HTMLElement;

  private shopDto: ShopDto = new ShopDto();

  private billDto: BillDto = new BillDto();

  private purchases: PurchaseDto[] = [];

  constructor(qrDto: FtsQrDto, { proxyService, dateHelper }: FetcherParams) {
    super(qrDto, ProviderCode.TAXCOM);
    if (proxyService === undefined) {
      throw new Error('Need to define proxy service for TaxcomFetcher');
    }
    this.proxyService = proxyService;
    this.dateHelper = dateHelper;
  }

  async fetchBill(): Promise<BillDto> {
    try {
      await this.loadData();
      this.parseRawData();
      this.getShop();
      this.getPurchases();
      this.billDto.shop = this.shopDto;
      this.billDto.purchases = this.purchases;
      this.billDto.billDate = this.dateHelper.transformFtsDateToDate(this.qrDto.ftsDateTime);
      this.found();
      return this.billDto;
    } catch (err) {
      Logger.error(err);
      this.throwError();
      return null;
    }
  }

  private getNthChild(node: HTMLElement, selector: string, nth = 0) {
    const items = node.querySelectorAll(selector);
    return items[nth];
  }

  private async loadData() {
    try {
      const response = await this.proxyService.request<string>({
        url: this.getUrl(),
        method: 'GET',
      });
      this.rawData = response.data;
    } catch (err) {
      Logger.error(err);
      throw err;
    }
  }

  private parseRawData() {
    this.html = parse(this.rawData, {
      style: false,
      script: false,
      lowerCaseTagName: true,
    }) as HTMLElement;
  }

  protected getPurchase(productItem: HTMLElement): PurchaseDto {
    const titleElement = productItem.querySelector('.value');
    const title = titleElement.childNodes[0].text;
    const priceElement = productItem.querySelector('.receipt-col1');
    const quantityElement = this.getNthChild(priceElement, '.value', 0);
    const pricePerItemElement = this.getNthChild(priceElement, '.value', 1);
    const quantity = quantityElement.childNodes[0].text;
    const price = pricePerItemElement.childNodes[0].text;
    const purchaseDto = new PurchaseDto();
    purchaseDto.quantity = Number(quantity);
    purchaseDto.price = Number(price);
    purchaseDto.title = decodeHtmlEntities(title.trim())
      .trim();
    this.billDto.totalSum += (purchaseDto.quantity * purchaseDto.price);
    return purchaseDto;
  }

  protected getPurchases(): PurchaseDto[] {
    this.billDto.totalSum = 0;
    const productsItemsWrapper = this.html.querySelector(this.productsSelector);
    const productsItems = productsItemsWrapper.querySelectorAll('.item');
    this.purchases = productsItems.map(element => this.getPurchase(element));
    return this.purchases;
  }

  protected getShop(): ShopDto {
    const titleElement = this.html.querySelector(this.shopTitleSelector);
    const title = titleElement.childNodes[0].rawText;
    const shopDataElement = this.html.querySelector(this.shopDataSelector);
    const tinElement = this.getNthChild(shopDataElement, '.value', 0);
    const tin = tinElement.childNodes[0].rawText.replace(/\D/gm, '');
    const addressElement = this.getNthChild(shopDataElement, '.value', 1);
    const address = addressElement.childNodes[0].rawText;
    this.shopDto.title = decodeHtmlEntities(title);
    this.shopDto.tin = tin;
    this.shopDto.address = decodeHtmlEntities(address);
    return this.shopDto;
  }

}