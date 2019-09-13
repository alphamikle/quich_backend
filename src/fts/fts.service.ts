import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosResponse, default as axios } from 'axios';
import * as https from 'https';
import { FtsAccountDto } from './dto/fts-account.dto';
import { FtsRegistrationDto } from './dto/fts-registration.dto';
import { FTS_USER_EXIST_ERROR, FTS_USER_NOT_EXIST_ERROR, INVALID_PHONE_ERROR, UNKNOWN_ERROR } from '../helpers/text';
import { FtsRemindDto } from './dto/fts-remind.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FtsAccountEntity } from '../user/entities/fts-account.entity';
import { Repository } from 'typeorm';
import { FtsQrDto } from './dto/fts-qr.dto';
import { FtsAccountToBillRequestEntity } from './entities/fts-account-to-bill-request.entity';
import { DateHelper } from '../helpers/date.helper';
import { FtsFetchResponse } from './dto/fts-fetch-response/response.dto';
import { FtsFetchResponseBill } from './dto/fts-fetch-response/bill.dto';

export interface FtsHeaders {
  'Device-Id': string;
  'Device-OS': string;
  'User-Agent'?: 'okhttp/3.0.1';
  'Authorization'?: string;
  'Host': string;
  'Version': string;
  'ClientVersion': string;
  'Connection': string;
  'Accept-Encoding': 'gzip';
}

@Injectable()
export class FtsService {
  private readonly api: AxiosInstance;
  private baseUrl: string;

  constructor(
    @InjectRepository(FtsAccountEntity) private readonly ftsAccountEntityRepository: Repository<FtsAccountEntity>,
    @InjectRepository(FtsAccountToBillRequestEntity)
    private readonly ftsAccountToBillRequestEntityRepository: Repository<FtsAccountToBillRequestEntity>,
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

  async assignBillRequestWithFtsAccount({ ftsAccountId, billRequestId }: { ftsAccountId: string, billRequestId: string }):
    Promise<FtsAccountToBillRequestEntity> {
    const ftsAccountToBillRequest = new FtsAccountToBillRequestEntity();
    ftsAccountToBillRequest.billRequestId = billRequestId;
    ftsAccountToBillRequest.ftsAccountId = ftsAccountId;
    return await this.ftsAccountToBillRequestEntityRepository.save(ftsAccountToBillRequest);
  }

  async getBillRequestToFtsAccountEntityByBillRequestId(billRequestId: string): Promise<FtsAccountToBillRequestEntity | undefined> {
    return await this.ftsAccountToBillRequestEntityRepository.findOne({ where: { billRequestId } });
  }

  setFtsUrl(baseUrl: string = 'https://proverkacheka.nalog.ru:9999'): void {
    this.baseUrl = baseUrl;
  }

  async signIn(signInCredentials: FtsAccountDto): Promise<boolean> {
    try {
      const response = await this.api.get('/v1/mobile/users/login', { headers: this.getHeaders(signInCredentials) });
      return response.status === 200;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async signUp(signUpCredentials: FtsRegistrationDto): Promise<string | true> {
    try {
      await this.api.post('/v1/mobile/users/signup', signUpCredentials);
      return true;
    } catch (err) {
      const response: AxiosResponse = err.response;
      if (response.status === 409) {
        return FTS_USER_EXIST_ERROR;
      } else if (response.status === 500) {
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

  async changeFtsAccountPassword({ password, phone }: { password: string, phone: string }): Promise<FtsAccountEntity> {
    const ftsAccount: FtsAccountEntity = await this.ftsAccountEntityRepository.findOne({ where: { phone } });
    ftsAccount.password = password;
    return await this.ftsAccountEntityRepository.save(ftsAccount);
  }

  async checkBillExistence({ fiscalNumber: fn, checkType: ct = 1, fiscalDocument: fd, fiscalProp: fp, dateTime, totalSum: ts }: FtsQrDto,
                           userCredentials: FtsAccountDto): Promise<boolean> {
    const formattedDate = this.formatDateToFtsDate(dateTime);
    const url = encodeURI(`/v1/ofds/*/inns/*/fss/${ fn }/operations/${ ct }/tickets/${ fd }?fiscalSign=${ fp }&date=${ formattedDate }&sum=${ ts }`);
    try {
      await this.api.get(url, { headers: this.getHeaders(userCredentials) });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async fetchBillData({ fiscalNumber, fiscalDocument, fiscalProp }: FtsQrDto, ftsAccountDto: FtsAccountDto): Promise<FtsFetchResponseBill> {
    const url = `/v1/inns/*/kkts/*/fss/${ fiscalNumber }/tickets/${ fiscalDocument }?fiscalSign=${ fiscalProp }&sendToEmail=no`;
    try {
      const response: FtsFetchResponse = await this.api.get(url, { headers: this.getHeaders(ftsAccountDto) });
      return response.data.document.receipt;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  private formatDateToFtsDate(date: Date): string {
    const isoDate = this.dateHelper.format(date, 'yyyy-MM-dd HH:mm');
    return isoDate.replace(/(-)|(:)/g, '').replace(' ', 'T');
  }

  private generateAuthorizationValue(userCredentials: FtsAccountDto): string {
    return `Basic ${ Buffer.from(`${ userCredentials.phone }:${ userCredentials.password }`).toString('base64') }`;
  }

  private getHeaders(userCredentials?: FtsAccountDto): FtsHeaders {
    const headers: FtsHeaders = {
      'Device-Id': '748036d688ec41c6',
      'User-Agent': 'okhttp/3.0.1',
      'Device-OS': 'Android 9.0',
      'Version': '2',
      'ClientVersion': '1.4.4.1',
      'Host': this.baseUrl,
      'Connection': this.baseUrl,
      'Accept-Encoding': 'gzip',
    };
    if (userCredentials) {
      headers.Authorization = this.generateAuthorizationValue(userCredentials);
    }
    return headers;
  }
}
