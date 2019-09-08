import { Injectable } from '@nestjs/common';
import { AxiosInstance, default as axios } from 'axios';
import * as https from 'https';
import { FtsAccountDto } from './dto/ftsAccount.dto';
import { FtsRegistrationDto } from './dto/ftsRegistration.dto';

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

  async signUp(signUpCredentials: FtsRegistrationDto) {
    try {
      const response = await this.api.post('mobile/users/signup', signUpCredentials);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  private getHeader(userCredentials?: FtsAccountDto) {
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

  generateAuthorizationValue(userCredentials: FtsAccountDto): string {
    return `Basic ${Buffer.from(`${userCredentials.phone}:${userCredentials.password}`).toString('base64')}`;
  }
}
