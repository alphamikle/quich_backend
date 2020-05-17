import { Browser, Page, Response } from 'puppeteer';
import { BaseOfdFetcher } from '~/ofd/base-ofd-fetcher';
import { PurchaseDto } from '~/purchase/dto/purchase.dto';
import { ShopDto } from '~/shop/dto/shop.dto';
import { BillDto } from '~/bill/dto/bill.dto';
import { FtsQrDto } from '~/fts/dto/fts-qr.dto';
import { PuppeteerService } from '~/puppeteer/puppeteer.service';
import { FetchResponse, Item } from '~/ofd/1-ofd.ru/interfaces';
import { DateHelper } from '~/helpers/date.helper';
import { ProviderCode } from '~/bill-provider/entities/bill-provider.entity';

export class FirstOfdPuppeteerFetcher extends BaseOfdFetcher {
  page: Page;

  browser: Browser;

  private readonly fiscalNumberSelector = '#numberFn';

  private readonly fiscalDocumentSelector = '#numberFd';

  private readonly fiscalPropSelector = '#fp';

  private readonly submitSelector = '#searchcheck > ng-include > form > button';

  private readonly mainUrl = 'https://consumer.1-ofd.ru/#/landing/receipt';

  private readonly fetchBillUrl = 'https://consumer.1-ofd.ru/api/tickets/ticket/';

  private fetchResponse: FetchResponse;

  constructor(qrDto: FtsQrDto, private readonly puppeteerService: PuppeteerService, private readonly dateHelper: DateHelper) {
    super(qrDto, ProviderCode.FIRST_OFD);
  }

  async fetchBill(): Promise<BillDto> {
    let billDto = null;
    await this.loadMainPage();
    await this.fillFieldsAndGetCheckData();
    if (this.isFound()) {
      billDto = this.getBillDto();
    }
    await this.page.waitFor(500);
    await this.page.close();
    await this.puppeteerService.closeBrowser();
    return billDto;
  }

  protected getPurchase(item?: Item): PurchaseDto {
    const purchase = new PurchaseDto();
    purchase.price = item.price / 100;
    purchase.quantity = item.quantity;
    purchase.title = item.name;
    this.bill.totalSum += purchase.price * purchase.quantity;
    return purchase;
  }

  protected getPurchases(): PurchaseDto[] {
    const purchases: PurchaseDto[] = [];
    const purchasesData = this.fetchResponse.ticket.items;
    this.bill.totalSum = 0;
    for (const purchaseData of purchasesData) {
      purchases.push(this.getPurchase(purchaseData));
    }
    return purchases;
  }

  protected getShop(): ShopDto {
    const shop = new ShopDto();
    shop.tin = this.fetchResponse.ticket.userInn.trim();
    shop.address = this.fetchResponse.retailPlaceAddress;
    shop.title = this.fetchResponse.orgTitle;
    return shop;
  }

  private async responseMiddleware(response: Response): Promise<void> {
    const url = response.url();
    if (url.match(this.fetchBillUrl) !== null) {
      this.fetchResponse = await response.json() as FetchResponse;
    }
  }

  private async loadMainPage(): Promise<void> {
    this.browser = await this.puppeteerService.browserInstance;
    this.page = await this.browser.newPage();
    this.page.on('response', (response) => this.responseMiddleware(response));
    await this.page.goto(this.mainUrl);
    await this.page.waitForSelector(this.fiscalPropSelector);
  }

  private async fillFieldsAndGetCheckData(): Promise<void> {
    const fiscalNumberField = await this.page.$(this.fiscalNumberSelector);
    await fiscalNumberField.focus();
    await this.page.keyboard.type(this.fiscalNumber);

    const fiscalDocumentField = await this.page.$(this.fiscalDocumentSelector);
    await fiscalDocumentField.focus();
    await this.page.keyboard.type(this.fiscalDocument);

    const fiscalPropField = await this.page.$(this.fiscalPropSelector);
    await fiscalPropField.focus();
    await this.page.keyboard.type(this.fiscalProp);

    const submitButton = await this.page.$(this.submitSelector);
    await submitButton.click();
    await this.page.waitFor(1000);
  }

  private isFound(): boolean {
    return !this.page.url()
      .match('ticket-not-found');
  }

  private getBillDto(): BillDto {
    if (this.fetchResponse !== null) {
      this.bill.billDate = this.dateHelper.parse(this.fetchResponse.ticket?.transactionDate);
      this.bill.shop = this.getShop();
      this.bill.purchases = this.getPurchases();
      return this.bill;
    }
    return null;
  }

}