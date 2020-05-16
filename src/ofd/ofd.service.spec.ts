import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { RequestService } from '../proxy/dto/requestable.interface';
import { OfdFetcher } from './ofd.ru/fetcher';
import { TaxcomFetcher } from './taxcom.ru/fetcher';
import { typeOrmOptions } from '../config';
import { BillRequest } from '../bill-request/entities/bill-request.entity';
import { BillRequestService } from '../bill-request/bill-request.service';
import { BillRequestModule } from '../bill-request/bill-request.module';
import { FtsQrDto } from '../fts/dto/fts-qr.dto';
import { DateHelper } from '../helpers/date.helper';
import { FirstOfdPuppeteerFetcher } from './1-ofd.ru/puppeteer-fetcher';
import { PuppeteerService } from '../puppeteer/puppeteer.service';

@Injectable()
class TestRequestService implements RequestService {
  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.request<T>(config);
  }
}

jest.setTimeout(600000);

describe('Ofd service test', () => {
  let requestService: TestRequestService;
  let billRequestService: BillRequestService;
  const dateHelper = new DateHelper();
  const puppeteerService = new PuppeteerService();

  const taxcomQrDto: FtsQrDto = {
    fiscalProp: '571333283',
    totalSum: 322.5,
    fiscalNumber: '9283440300110611',
    fiscalDocument: '430',
    ftsDateTime: '20190512T1432',
    checkType: 1,
  };

  const ofdQrDto = {
    fiscalProp: '2834357247',
    totalSum: 328,
    fiscalNumber: '9282000100387649',
    fiscalDocument: '21303',
    dateTime: '20200125T1328',
    checkType: 1,
  };

  const firstOfdQrDto: FtsQrDto = {
    fiscalProp: '2618158950',
    fiscalNumber: '9289000100402029',
    fiscalDocument: '15535',
  };

  Logger.log('Ofd service test');

  beforeAll(async (done) => {
    Logger.log('Start ofd service tests');
    requestService = new TestRequestService();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmOptions),
        TypeOrmModule.forFeature([BillRequest]),
        BillRequestModule,
      ],
      providers: [
        BillRequestService,
        DateHelper,
      ],
    })
      .compile();
    billRequestService = module.get(BillRequestService);
    done();
    Logger.log('End ofd service tests');
  });

  it.skip('Target ofd test', async () => {
    const entities = await billRequestService.getBillRequests({
      limit: 30,
      offset: 10,
    });
    for (const billRequestEntity of entities) {
      const qrDto = new FtsQrDto();
      qrDto.fiscalProp = billRequestEntity.fiscalProp;
      qrDto.totalSum = billRequestEntity.totalSum;
      qrDto.fiscalNumber = billRequestEntity.fiscalNumber;
      qrDto.fiscalDocument = billRequestEntity.fiscalDocument;
      qrDto.ftsDateTime = dateHelper.transformDateToFtsDate(billRequestEntity.billDate);
      qrDto.checkType = 1;
      const fetcher = new FirstOfdPuppeteerFetcher(qrDto, puppeteerService, dateHelper);
      const billData = await fetcher.fetchBill() as unknown as string;
      if (billData === undefined) {
        console.log(billData);
        return;
      }
    }
    await puppeteerService.closeBrowser();
  });

  it('Check working of taxcom fetcher', async (done) => {
    const taxcomFetcher = new TaxcomFetcher(taxcomQrDto, {
      proxyService: requestService,
      dateHelper: new DateHelper(),
    });
    const billDto = await taxcomFetcher.fetchBill();
    expect(billDto)
      .not
      .toBeNull();
    expect(billDto.purchases.length)
      .toBeGreaterThan(0);
    done();
  });

  it('Ofd service test', async (done) => {
    const ofdFetcher = new OfdFetcher(ofdQrDto, { proxyService: requestService });
    const billDto = await ofdFetcher.fetchBill();
    expect(billDto)
      .not
      .toBeNull();
    expect(billDto.purchases.length)
      .toBeGreaterThan(0);
    done();
  });

  it('1-OFD service test', async (done) => {
    const ofdFetcher = new FirstOfdPuppeteerFetcher(firstOfdQrDto, puppeteerService, dateHelper);
    const billDto = await ofdFetcher.fetchBill();
    expect(billDto)
      .not
      .toBeNull();
    expect(billDto.purchases.length)
      .toBeGreaterThan(0);
    done();
  });
});