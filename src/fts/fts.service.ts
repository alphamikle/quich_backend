import { Injectable, Logger, RequestTimeoutException }                                                                                                                 from '@nestjs/common';
import axios, { AxiosInstance }                                                                                                                                        from 'axios';
import * as https                                                                                                                                                      from 'https';
import { InjectRepository }                                                                                                                                            from '@nestjs/typeorm';
import { Between, Repository }                                                                                                                                         from 'typeorm';
import { FtsAccountDto }                                                                                                                                               from './dto/fts-account.dto';
import { FtsRegistrationDto }                                                                                                                                          from './dto/fts-registration.dto';
import { FTS_BILL_NOT_SEND_ERROR, FTS_TRY_MORE_ERROR, FTS_UNKNOWN_FETCHING_ERROR, FTS_USER_EXIST_ERROR, FTS_USER_NOT_EXIST_ERROR, INVALID_PHONE_ERROR, UNKNOWN_ERROR } from '../helpers/text';
import { FtsRemindDto }                                                                                                                                                from './dto/fts-remind.dto';
import { FtsAccountEntity }                                                                                                                                            from '../user/entities/fts-account.entity';
import { FtsQrDto }                                                                                                                                                    from './dto/fts-qr.dto';
import { DateHelper }                                                                                                                                                  from '../helpers/date.helper';
import { FtsFetchResponse }                                                                                                                                            from './dto/fts-fetch-response/response.dto';
import { FtsFetchResponseBill }                                                                                                                                        from './dto/fts-fetch-response/bill.dto';
import { randomOS, randomUUID, wait }                                                                                                                                  from '../helpers/common.helper';
import { FtsAccountUsingsEntity }                                                                                                                                      from './entities/fts-account-usings.entity';

export interface FtsHeaders {
  'Device-Id': string;
  'Device-OS': string;
  'User-Agent'?: 'okhttp/3.0.1';
  Authorization?: string;
  Host: string;
  Version: string;
  ClientVersion: string;
  Connection: string;
  'Accept-Encoding': 'gzip';
}

@Injectable()
export class FtsService {
  private readonly api: AxiosInstance;

  private baseUrl: string;

  constructor(
    @InjectRepository(FtsAccountEntity)
    private readonly ftsAccountEntityRepository: Repository<FtsAccountEntity>,
    @InjectRepository(FtsAccountUsingsEntity)
    private readonly ftsAccountUsingsRepository: Repository<FtsAccountUsingsEntity>,
    private readonly dateHelper: DateHelper,
  ) {
    this.setFtsUrl();
    this.api = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      baseURL: this.baseUrl,
    });
  }

  setFtsUrl(baseUrl = 'https://proverkacheka.nalog.ru:9999'): void {
    this.baseUrl = baseUrl;
  }

  async signIn(signInCredentials: FtsAccountDto): Promise<boolean> {
    try {
      const response = await this.api.get('/v1/mobile/users/login', {
        headers: this.getHeaders(signInCredentials),
      });
      return response.status === 200;
    } catch (err) {
      return false;
    }
  }

  async signUp(signUpCredentials: FtsRegistrationDto): Promise<string | true> {
    try {
      await this.api.post('/v1/mobile/users/signup', signUpCredentials);
      return true;
    } catch (err) {
      const { response } = err;
      if (response.status === 409) {
        return FTS_USER_EXIST_ERROR;
      }
      if (response.status === 500) {
        return INVALID_PHONE_ERROR;
      }
      return err.message || UNKNOWN_ERROR;
    }
  }

  async remindPassword({ phone }: FtsRemindDto): Promise<string | true> {
    try {
      await this.api.post('/v1/mobile/users/restore', { phone });
      return true;
    } catch (err) {
      return FTS_USER_NOT_EXIST_ERROR;
    }
  }

  async changeFtsAccountPassword({ password, phone }: { password: string; phone: string; }): Promise<FtsAccountEntity> {
    const ftsAccount: FtsAccountEntity = await this.ftsAccountEntityRepository.findOne({ where: { phone } });
    ftsAccount.password = password;
    return this.ftsAccountEntityRepository.save(ftsAccount);
  }

  async checkBillExistence({ fiscalNumber: fn, checkType: ct = 1, fiscalDocument: fd, fiscalProp: fp, dateTime, totalSum: ts }: FtsQrDto, userCredentials: FtsAccountDto): Promise<boolean> {
    const penny = ts * 100;
    const preUrl = '/v1/ofds/*/inns/*/fss/';
    const url = encodeURI(
      `${preUrl}${fn}/operations/${ct}/tickets/${fd}?fiscalSign=${fp}&date=${dateTime}&sum=${penny}`,
    );
    try {
      await this.api.get(url, { headers: this.getHeaders(userCredentials) });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async fetchBillData({ fiscalNumber, fiscalDocument, fiscalProp }: FtsQrDto, ftsAccountDto: FtsAccountDto, count = 0, limit = 3): Promise<FtsFetchResponseBill | string> {
    if (count > 0) {
      await wait(500 * count);
    }
    const url = `/v1/inns/*/kkts/*/fss/${fiscalNumber}/tickets/${fiscalDocument}?fiscalSign=${fiscalProp}&sendToEmail=no`;
    try {
      if (count >= limit) {
        throw new RequestTimeoutException();
      }
      const response: FtsFetchResponse = await this.api.get(url, {
        headers: this.getHeaders(ftsAccountDto),
      });
      if (response.status !== 200) {
        return this.fetchBillData(
          {
            fiscalNumber,
            fiscalDocument,
            fiscalProp,
          },
          ftsAccountDto,
          count + 1,
        );
      }
      return response.data.document.receipt;
    } catch (err) {
      Logger.error(`FETCHING ERROR ${JSON.stringify(err.message)}`);
      if (count < limit) {
        return this.fetchBillData(
          {
            fiscalNumber,
            fiscalDocument,
            fiscalProp,
          },
          ftsAccountDto,
          count + 1,
        );
      }
      let error = FTS_TRY_MORE_ERROR;
      if (err.response && err.response.status) {
        const { status } = err.response;
        switch (status) {
          case 406: {
            error = FTS_BILL_NOT_SEND_ERROR;
            break;
          }
          default: {
            error = FTS_UNKNOWN_FETCHING_ERROR;
            break;
          }
        }
      }
      return error;
    }
  }

  async incrementUsesOfFtsAccount(phone: string): Promise<void> {
    const currentDate = new Date();
    const nextDate = this.dateHelper.addDays(currentDate, 1);
    let currentDateUses = await this.ftsAccountUsingsRepository.findOne({
      where: {
        phone,
        usingDay: Between(currentDate, nextDate),
      },
    });
    if (currentDateUses === undefined) {
      currentDateUses = new FtsAccountUsingsEntity();
      currentDateUses.phone = phone;
      currentDateUses.usingDay = currentDate;
      currentDateUses.uses = 0;
    }
    currentDateUses.uses += 1;
    await this.ftsAccountUsingsRepository.save(currentDateUses);
  }

  private generateAuthorizationValue(userCredentials: FtsAccountDto): string {
    return `Basic ${Buffer.from(`${userCredentials.phone}:${userCredentials.password}`)
      .toString('base64')}`;
  }

  private getHeaders(userCredentials?: FtsAccountDto): FtsHeaders {
    const uuid = randomUUID()
      .replace('-', '')
      .slice(0, 16);
    const headers: FtsHeaders = {
      'Device-Id': uuid,
      'User-Agent': 'okhttp/3.0.1',
      'Device-OS': randomOS(),
      Version: '2',
      ClientVersion: '1.4.5',
      Host: this.baseUrl,
      Connection: this.baseUrl,
      'Accept-Encoding': 'gzip',
    };
    if (userCredentials) {
      headers.Authorization = this.generateAuthorizationValue(userCredentials);
    }
    return headers;
  }
}
