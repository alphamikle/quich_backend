import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosResponse, default as axios } from 'axios';
import * as https from 'https';
import { FtsAccountDto } from './dto/fts-account.dto';
import { FtsRegistrationDto } from './dto/fts-registration.dto';
import { FTS_USER_EXIST_ERROR, FTS_USER_NOT_EXIST_ERROR, INVALID_PHONE_ERROR, UNKNOWN_ERROR } from '../helpers/text';
import { FtsRemindDto } from './dto/fts-remind.dto';

interface FtsHeaders {
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

  constructor() {
    this.api = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      baseURL: 'https://proverkacheka.nalog.ru:9999/v1/',
    });
  }

  async signIn(signInCredentials: FtsAccountDto): Promise<boolean> {
    try {
      const response = await this.api.get('mobile/users/login', { headers: this.getHeader(signInCredentials) });
      return response.status === 200;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async signUp(signUpCredentials: FtsRegistrationDto): Promise<string | true> {
    try {
      await this.api.post('mobile/users/signup', signUpCredentials);
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
      await this.api.post('mobile/users/restore', { phone });
      return true;
    } catch (err) {
      return FTS_USER_NOT_EXIST_ERROR;
    }
  }

  generateAuthorizationValue(userCredentials: FtsAccountDto): string {
    return `Basic ${ Buffer.from(`${ userCredentials.phone }:${ userCredentials.password }`).toString('base64') }`;
  }

  private getHeader(userCredentials?: FtsAccountDto): FtsHeaders {
    const headers: FtsHeaders = {
      'Device-Id': '748036d688ec41c6',
      'User-Agent': 'okhttp/3.0.1',
      'Device-OS': 'Android 9.0',
      'Version': '2',
      'ClientVersion': '1.4.4.1',
      'Host': 'https://proverkacheka.nalog.ru:9999',
      'Connection': 'https://proverkacheka.nalog.ru:9999',
      'Accept-Encoding': 'gzip',
    };
    if (userCredentials) {
      headers.Authorization = this.generateAuthorizationValue(userCredentials);
    }
    return headers;
  }
}
