import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Test, TestingModule }                      from '@nestjs/testing';
import { TypeOrmModule }                            from '@nestjs/typeorm';
import { Injectable }                               from '@nestjs/common';
import { RequestService }                           from '../proxy/dto/requestable.interface';
import { OfdFetcher }                               from './ofd.ru/fetcher';
import { TaxcomFetcher }                            from './taxcom.ru/fetcher';
import { typeOrmOptions }                           from '../config';
import { BillRequestEntity }                        from '../bill-request/entities/bill-request.entity';
import { BillRequestService }                       from '../bill-request/bill-request.service';
import { BillRequestModule }                        from '../bill-request/bill-request.module';
import { FtsQrDto }                                 from '../fts/dto/fts-qr.dto';
import { DateHelper }                               from '../helpers/date.helper';

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

  beforeEach(async () => {
    requestService = new TestRequestService();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmOptions),
        TypeOrmModule.forFeature([BillRequestEntity]),
        BillRequestModule,
      ],
      providers: [
        BillRequestService,
        DateHelper,
      ],
    })
      .compile();
    billRequestService = module.get(BillRequestService);
  });

  it('Ofd service test', async () => {
    const qrDto = {
      'checkType': 1,
      'dateTime': '20200125T1328',
      'fiscalDocument': '21303',
      'fiscalNumber': '9282000100387649',
      'fiscalProp': '2834357247',
      'totalSum': 328,
    };
    const ofdFetcher = new OfdFetcher(qrDto, { proxyService: requestService });
    const response = await ofdFetcher.fetchBill();
    expect(response.purchases.length)
      .toBeGreaterThan(0);
  });

  it('Target ofd test', async () => {
    const entities = await billRequestService.getBillRequests({
      limit: 40,
      offset: 10,
    });
    for (const billRequestEntity of entities) {
      const qrDto = new FtsQrDto();
      qrDto.fiscalProp = billRequestEntity.fiscalProp;
      qrDto.totalSum = billRequestEntity.totalSum;
      qrDto.fiscalNumber = billRequestEntity.fiscalNumber;
      qrDto.fiscalDocument = billRequestEntity.fiscalDocument;
      qrDto.dateTime = billRequestEntity.billDate.toISOString();
      qrDto.checkType = 1;
      const taxcomFetcher = new TaxcomFetcher(qrDto, { proxyService: requestService });
      const billData = await taxcomFetcher.fetchBill() as unknown as string;
      if (billData && !billData.match('Чек по указанным параметрам не найден')) {
        console.log('Found check with data:', qrDto, billData);
      }
    }
  });

  it('Check working of taxcom fetcher', async () => {
    const existQrDto = new FtsQrDto();
    existQrDto.fiscalProp = '571333283';
    existQrDto.totalSum = 322.5;
    existQrDto.fiscalNumber = '9283440300110611';
    existQrDto.fiscalDocument = '430';
    existQrDto.dateTime = '20190512T1432';
    existQrDto.checkType = 1;

    const taxcomFetcher = new TaxcomFetcher(existQrDto, {
      proxyService: requestService,
      dateHelper: new DateHelper(),
    });
    const billDto = await taxcomFetcher.fetchBill();
    expect(billDto)
      .not
      .toBeNull();
    console.log(billDto);
  });
});