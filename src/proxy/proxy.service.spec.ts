import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyService } from './proxy.service';
import { PuppeteerService } from '../puppeteer/puppeteer.service';
import { ProxyEntity } from './entity/proxy.entity';
import { PuppeteerModule } from '../puppeteer/puppeteer.module';
import { typeOrmOptions } from '../config';

jest.setTimeout(600000);

describe('ProxyService', () => {
  let service: ProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ TypeOrmModule.forRoot(typeOrmOptions), TypeOrmModule.forFeature([ ProxyEntity ]), PuppeteerModule ],
      providers: [ ProxyService, PuppeteerService ],
    }).compile();

    service = module.get(ProxyService);
  });

  it('Load to DB proxy list', async () => {
    await service.refreshProxies();
  });

  it('Warm proxies', async () => {
    await service.warmProxies();
  });

  it('Reset proxies', async () => {
    await service.resetProxies();
  });
});