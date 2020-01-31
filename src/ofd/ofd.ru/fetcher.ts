import { HTMLElement, NodeType, parse } from 'node-html-parser';
import { AllHtmlEntities } from 'html-entities';
import axios from 'axios';
import { BaseOfdFetcher } from '../base-ofd-fetcher';
import { ShopDto } from '../../shop/dto/shop.dto';
import { PurchaseDto } from '../../purchase/dto/purchase.dto';
import { FtsQrDto } from '../../fts/dto/fts-qr.dto';
import { BillDto } from '../../bill/dto/bill.dto';
import { fetchError } from '../fetcher-error';

export class OfdFetcher extends BaseOfdFetcher {
  private body: HTMLElement;

  constructor(qrDto: FtsQrDto) {
    super(qrDto, 'OFD');
  }

  async fetchBill(): Promise<BillDto> {
    try {
      const rawData = await this.getRawData();
      this.found();
      return this.getParsedData(rawData);
    } catch (err) {
      fetchError(OfdFetcher, err.message);
      this.notFound();
      return null;
    }
  }

  protected getShop(): ShopDto {
    const shopTitle = this.getShopTitle();
    const shopAddress = this.getShopAddress();
    const shopPrettyTitle = this.getShopPrettyTitle();
    const shopTin = this.getShopTin();
    const shop = new ShopDto();
    shop.title = shopPrettyTitle || shopTitle;
    shop.address = shopAddress;
    shop.tin = shopTin;
    return shop;
  }

  protected getPurchases(): PurchaseDto[] {
    const allBlocks = this.body.querySelectorAll('.margin-top-10');
    const blocksLength = [ ...allBlocks ].length;
    const productsBlock = this.getNthBlock(blocksLength - 1);
    const productsSubBlocks = productsBlock.querySelectorAll('.ifw-bill-item');
    const productsWithoutQR = [ ...productsSubBlocks ].slice(0, productsSubBlocks.length - 1);
    const products: PurchaseDto[] = [];
    for (const productBlock of productsWithoutQR) {
      products.push(this.getPurchase(productBlock));
    }
    return products;
  }

  protected getPurchase(productNode: HTMLElement): PurchaseDto {
    const productTitle = productNode.querySelector('.text-left').rawText;
    const productPriceBlock = productNode.querySelector('.text-right');
    const productQuantity = productPriceBlock.querySelector('div').querySelectorAll('span')[ 0 ].rawText;
    const productPrice = productPriceBlock.querySelector('div').querySelectorAll('span')[ 2 ].rawText;
    const quantity = Math.trunc(Number(productQuantity.replace(',', '.')) * 100) / 100;
    const price = Math.trunc(Number(productPrice.replace(',', '.')) * 100) / 100;
    const sum = quantity * price;
    this.bill.totalSum += sum;
    return {
      title: productTitle,
      quantity,
      price,
    };
  }

  private async getRawData(): Promise<string> {
    const url = `https://check.ofd.ru/rec/${ this.fiscalNumber }/${ this.fiscalDocument }/${ this.fiscalProp }`;
    const rawResponse = await axios.get(url);
    return rawResponse.data;
  }

  private async getParsedData(rawData: string): Promise<BillDto> {
    const parsedData = parse(rawData, { style: false, script: false, lowerCaseTagName: true });
    if (parsedData.nodeType === NodeType.ELEMENT_NODE) {
      const node = parsedData as HTMLElement;
      this.body = node.querySelector('.ifw-card-body');
      const dateTime = this.getCartDateTime();
      const products = await this.getPurchases();
      this.bill.shop = this.getShop();
      this.bill.billDate = dateTime;
      this.bill.purchases = products;
      return this.bill;
    }
    return null;
  }

  private decodeEntities(val: string): string {
    return (new AllHtmlEntities()).decode(val);
  }

  private getNthBlock(val = 0): HTMLElement {
    return this.body.querySelectorAll('.margin-top-10')[ val ];
  }

  private getRightBlockOf(val = 0): string {
    const nthBlock = this.getNthBlock(val);
    return nthBlock.querySelector('.text-right').rawText;
  }

  private getShopTitle(): string {
    return this.decodeEntities(this.getNthBlock(0).querySelector('.text-align-center').firstChild.childNodes[ 0 ].rawText);
  }

  private getCartDateTime(): Date {
    const stringDate = this.getRightBlockOf(2);
    const [ date, time ] = stringDate.split(' ');
    const [ day, month, year ] = date.split('.');
    const [ hours, minutes ] = time.split(':');
    return new Date(Number(`20${ year }`), Number(month) - 1, Number(day), Number(hours), Number(minutes));
  }

  private getShopAddress(): string {
    return this.getRightBlockOf(3);
  }

  private getShopTin(): string {
    return this.getRightBlockOf(11);
  }

  private getShopPrettyTitle(): string {
    return this.decodeEntities(this.getRightBlockOf(4));
  }

}
