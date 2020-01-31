import { Test, TestingModule } from '@nestjs/testing';
import { PuppeteerService } from './puppeteer.service';

describe('PuppeteerService', () => {
  let service: PuppeteerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ PuppeteerService ],
    }).compile();

    service = module.get<PuppeteerService>(PuppeteerService);
  });

  it('get free proxy list', async () => {
    const proxyList = await service.getFreeProxyList();
    console.log(proxyList);
  });
});
