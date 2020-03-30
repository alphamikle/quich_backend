import { Repository }             from 'typeorm';
import { FtsService }             from './fts.service';
import { FtsAccountDto }          from './dto/fts-account.dto';
import { FtsQrDto }               from './dto/fts-qr.dto';
import { FtsAccountEntity }       from '../user/entities/fts-account.entity';
import { FtsAccountUsingsEntity } from './entities/fts-account-usings.entity';
import { DateHelper }             from '../helpers/date.helper';
import { fetchBillDataEqual }     from './test-equals/equals';
import { Logger }                 from '@nestjs/common';

jest.setTimeout(600000);

const { TEST_FTS_PASSWORD, TEST_FTS_PHONE } = process.env;

if (TEST_FTS_PASSWORD === undefined || TEST_FTS_PHONE === undefined) {
  throw new Error('Needed env`s are not specified for test');
}

describe('Fts service test', () => {
  let service: FtsService;

  const firstTestQrDto: FtsQrDto = {
    dateTime: '20200322T151500',
    fiscalDocument: '104630',
    fiscalNumber: '9289000100344931',
    fiscalProp: '4163986685',
    totalSum: 853.56,
  } as const;

  const testAccount: FtsAccountDto = {
    password: TEST_FTS_PASSWORD,
    phone: TEST_FTS_PHONE,
  } as const;

  beforeAll(async () => {
    const ftsAccountEntityRepository = new Repository<FtsAccountEntity>();
    const ftsAccountUsingsRepository = new Repository<FtsAccountUsingsEntity>();
    const dateHelper = new DateHelper();
    service = new FtsService(ftsAccountEntityRepository, ftsAccountUsingsRepository, dateHelper);
  });

  it('check bill data', async (done) => {
    Logger.log('Start checking bill');
    const billData = await service.checkBillExistence(firstTestQrDto, testAccount);
    expect(billData)
      .toBe(true);
    done();
    Logger.log('End checking bill');
  });

  it('fetch bill data', async (done) => {
    Logger.log('Start fetching bill');
    const billData = await service.fetchBillData(firstTestQrDto, testAccount);
    expect(billData)
      .toEqual(fetchBillDataEqual);
    done();
    Logger.log('End fetching bill');
  });
});