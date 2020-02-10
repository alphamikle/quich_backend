import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestService }                           from '../proxy/dto/requestable.interface';
import { OfdFetcher }                               from './ofd.ru/fetcher';

class TestRequestService implements RequestService {
  request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axios.request<T>(config);
  }
}

jest.setTimeout(600000);

describe('Ofd service test', () => {
  let requestService = new TestRequestService();

  beforeEach(async () => {
    requestService = new TestRequestService();
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
});