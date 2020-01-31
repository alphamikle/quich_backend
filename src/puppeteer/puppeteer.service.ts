import { Injectable } from '@nestjs/common';
import { ElementHandle, launch, LaunchOptions } from 'puppeteer';

const isDev = process.env.NODE_ENV === 'development';

function child(num: number): string {
  return `:nth-child(${ num })`;
}

async function getInnerText(element: ElementHandle): Promise<string> {
  const value: string = await (await element.getProperty('innerText')).jsonValue() as string;
  return value;
}

async function isNextEnabled(nextElement: ElementHandle): Promise<boolean> {
  const classNames = await (await nextElement.getProperty('className')).jsonValue() as string;
  return !classNames.includes('disabled');
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

@Injectable()
export class PuppeteerService {
  private readonly options: LaunchOptions = {
    headless: isDev,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  };

  public async getFreeProxyList() {
    const limitSelector = '#proxylisttable_length > label > select';
    const tableSelector = '#proxylisttable > tbody';
    const httpsSelector = '#proxylisttable > tfoot > tr > th.hx.ui-state-default > select';
    const nextButtonSelector = '#proxylisttable_next';

    const rowsData: ProxyParams[] = [];

    const browser = await launch(this.options);
    const page = await browser.newPage();
    await page.goto('https://free-proxy-list.net/');
    await page.waitForSelector(limitSelector);
    await page.select(limitSelector, '80');
    await page.select(httpsSelector, 'yes');

    let nextElement = await page.$(nextButtonSelector);

    const getData: () => Promise<void> = async () => {
      const tableBody = await page.$(tableSelector);
      const rows = await tableBody.$$('tr');
      rowsData.push(...await this.getRowsData(rows));
      if (await isNextEnabled(nextElement)) {
        await nextElement.click({ delay: 10 });
        nextElement = await page.$(nextButtonSelector);
        await getData();
      }
    };
    await getData();
    await page.close();
    await browser.close();

    return rowsData.filter(rowData => rowData.anonymity !== Anonymity.TRANSPARENT && rowData.isHttps === true);
  }

  private async getRowsData(rows: ElementHandle[]): Promise<ProxyParams[]> {
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
      proxy.anonymity = await getInnerText(anonymityElement) as Anonymity;
      proxy.isHttps = (await getInnerText(httpsElement)) === 'yes';
      data.push(proxy);
    }
    return data;
  }
}
