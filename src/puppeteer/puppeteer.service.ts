import { Injectable, Logger }                                  from '@nestjs/common';
import { Browser, ElementHandle, launch, LaunchOptions, Page } from 'puppeteer';
import { resolve }                                             from 'path';
import { readdirSync, readFileSync, unlinkSync }               from 'fs';

const isDev = process.env.NODE_ENV === 'development';

const curDir = resolve(__dirname);

function child(num: number): string {
  return `:nth-child(${num})`;
}

async function getInnerText(element: ElementHandle): Promise<string> {
  const value: string = (await (await element.getProperty(
    'innerText',
  )).jsonValue()) as string;
  return value;
}

async function isNextEnabled(nextElement: ElementHandle): Promise<boolean> {
  const classNames = (await (await nextElement.getProperty(
    'className',
  )).jsonValue()) as string;
  return !classNames.includes('disabled');
}

async function sendToClient(page: Page): Promise<void> {
  const client = await page.target()
    .createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: curDir,
  });
}

enum Anonymity {
  ANON = 'anonymous',
  ELITE = 'elite proxy',
  TRANSPARENT = 'transparent',
}

interface ProxyParams {
  ip: string;
  port: number;
  anonymity: Anonymity;
  isHttps: boolean;
}

function readFile(): ProxyParams[] {
  const files = readdirSync(curDir);
  const txtFile = files.find(file => file.includes('txt'));
  const txtPath = resolve(curDir, txtFile);
  const fileBuffer = readFileSync(txtPath);
  const proxyParams = fileBuffer
    .toString('utf-8')
    .split('\n')
    .map(row => {
      const [ip, port] = row.replace('\r', '')
        .split(':');
      const proxyParam: ProxyParams = {
        isHttps: false,
        port: Number(port),
        ip,
        anonymity: Anonymity.ANON,
      };
      return proxyParam;
    });
  unlinkSync(txtPath);
  return proxyParams.filter(param => !Number.isNaN(param.port));
}

async function scrollPage(page: Page): Promise<void> {
  await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    window.scrollBy(0, 300);
  });
}

@Injectable()
export class PuppeteerService {
  private usingCounter = 0;

  private browser: Promise<Browser> = null;

  private readonly options: LaunchOptions = {
    headless: isDev,
    defaultViewport: null,
    args: ['--window-size=1920,1080'],
  };

  public get browserInstance(): Promise<Browser> {
    return this.openBrowser();
  }

  public async getFreeProxyList(): Promise<ProxyParams[]> {
    const limitSelector = '#proxylisttable_length > label > select';
    const tableSelector = '#proxylisttable > tbody';
    const httpsSelector =
      '#proxylisttable > tfoot > tr > th.hx.ui-state-default > select';
    const nextButtonSelector = '#proxylisttable_next';

    const rowsData: ProxyParams[] = [];

    const browser = await this.openBrowser();
    const page = await browser.newPage();
    await page.goto('https://free-proxy-list.net/');
    await page.waitForSelector(limitSelector);
    await page.select(limitSelector, '80');
    await page.select(httpsSelector, 'yes');

    let nextElement = await page.$(nextButtonSelector);

    const getData: () => Promise<void> = async () => {
      const tableBody = await page.$(tableSelector);
      const rows = await tableBody.$$('tr');
      rowsData.push(...(await this.getFreeProxyListTableRowData(rows)));
      if (await isNextEnabled(nextElement)) {
        await nextElement.click({ delay: 10 });
        nextElement = await page.$(nextButtonSelector);
        await getData();
      }
    };
    await getData();
    await page.close();
    await this.closeBrowser();

    return rowsData.filter(
      rowData =>
        rowData.anonymity !== Anonymity.TRANSPARENT && rowData.isHttps === true,
    );
  }

  public async getOpenProxyList(): Promise<ProxyParams[]> {
    const httpProxyLinkSelector = '.list.http';
    const downloadButtonSelector = '.download';

    const browser = await this.openBrowser();
    const page = await browser.newPage();
    await page.goto('https://openproxy.space/list');
    await scrollPage(page);
    await page.waitForSelector(httpProxyLinkSelector);
    await page.click(httpProxyLinkSelector);
    await page.waitForSelector(downloadButtonSelector);
    await page.click(downloadButtonSelector);
    await sendToClient(page);
    await page.waitFor(6000);
    const proxyParams = readFile();

    await page.close();
    await this.closeBrowser();
    return proxyParams;
  }

  public async getProxyScrapeList(): Promise<ProxyParams[]> {
    const downloadHttpSelector = '#downloadhttp';

    const browser = await this.openBrowser();
    const page = await browser.newPage();
    await page.goto('https://proxyscrape.com/free-proxy-list');
    await page.waitForSelector(downloadHttpSelector);
    await page.waitFor(2000);
    await page.click(downloadHttpSelector);
    await sendToClient(page);
    await page.waitFor(8000);
    const proxyParams = readFile();

    await page.close();
    await this.closeBrowser();
    return proxyParams;
  }

  public async getProxyDownloadList(): Promise<ProxyParams[]> {
    const downloadBtnSelector = '#downloadbtn';
    const filterSelector = '#country-select1 > dt';
    const anonymousSelector = '#mislista2 > li:nth-child(3) > input';
    const eliteSelector = '#mislista2 > li:nth-child(4) > input';
    const filterButtonSelector = '#miboto';

    const browser = await this.openBrowser();
    const page = await browser.newPage();
    await page.goto('https://www.proxy-list.download/HTTPS');
    await page.waitForSelector(filterSelector);
    await page.click(filterSelector);
    await page.waitFor(400);
    await page.click(anonymousSelector);
    await page.waitFor(300);
    await page.click(eliteSelector);
    await page.waitFor(500);
    await page.click(filterButtonSelector);
    await page.waitFor(600);
    await page.click(downloadBtnSelector);
    await sendToClient(page);
    await page.waitFor(8000);
    const proxyParams = readFile();

    await page.close();
    await this.closeBrowser();
    return proxyParams;
  }

  private async getFreeProxyListTableRowData(
    rows: ElementHandle[],
  ): Promise<ProxyParams[]> {
    const data: ProxyParams[] = [];
    for await (const row of rows) {
      const proxy: ProxyParams = {
        ip: '',
        port: 80,
        anonymity: Anonymity.TRANSPARENT,
        isHttps: true,
      };
      const ipElement = await row.$(child(1));
      const portElement = await row.$(child(2));
      const anonymityElement = await row.$(child(5));
      const httpsElement = await row.$(child(7));

      proxy.ip = await getInnerText(ipElement);
      proxy.port = Number(await getInnerText(portElement));
      proxy.anonymity = (await getInnerText(anonymityElement)) as Anonymity;
      proxy.isHttps = (await getInnerText(httpsElement)) === 'yes';
      data.push(proxy);
    }
    return data;
  }

  private openBrowser(): Promise<Browser> {
    this.usingCounter += 1;
    const beforeOpen = Date.now();
    if (this.browser === null) {
      this.browser = launch(this.options);
      this.browser.then(() => {
        Logger.log(`Browser open in ${Date.now() - beforeOpen}ms`, this.constructor.name);
      });
    }
    return this.browser;
  }

  public async closeBrowser(): Promise<void> {
    this.usingCounter -= 1;
    Logger.log(`Trying to close browser with ${this.usingCounter} operations left`, this.constructor.name);
    if (this.usingCounter <= 0) {
      await (await this.browser).close();
      this.browser = null;
      Logger.log('The browser closed', this.constructor.name);
    }
  }
}
