import { Test, TestingModule } from '@nestjs/testing';
import { PuppeteerService }    from './puppeteer.service';

jest.setTimeout(60 * 1000);

describe('PuppeteerService', () => {
  let service: PuppeteerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuppeteerService],
    })
      .compile();

    service = module.get<PuppeteerService>(PuppeteerService);
  });

  it('get free proxy list', async () => {
    await service.getFreeProxyList();
  });

  it('get open proxy list', async () => {
    const list = await service.getOpenProxyList();
    console.log(list.length);
  });

  it('get proxy scrape list', async () => {
    const list = await service.getProxyScrapeList();
    console.log(list.length);
  });

  it('proxy list download', async () => {
    const list = await service.getProxyDownloadList();
    console.log(list.length);
  });
});
