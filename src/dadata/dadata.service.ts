import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line import/no-named-default
import { AxiosInstance, AxiosResponse, default as axios } from 'axios';
import { DadataResponse, Suggestion } from '~/dadata/dto/response.interface';

const { DADATA_TOKEN } = process.env;

@Injectable()
export class DadataService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/',
      headers: {
        Authorization: `Token ${ DADATA_TOKEN }`,
      },
    });
  }

  async getShopInfoByTin(tin: string): Promise<Suggestion> {
    try {
      const response: AxiosResponse<DadataResponse> = await this.api.post('findById/party', {
        query: tin,
        // eslint-disable-next-line @typescript-eslint/camelcase
        branch_type: 'MAIN',
      });
      return response.data.suggestions[0];
    } catch (err) {
      Logger.error(err);
      return null;
    }
  }

  async getShopInfoByProps(query: string): Promise<Suggestion> {
    try {
      const response: AxiosResponse<DadataResponse> = await this.api.post('suggest/party', {
        query,
      });
      return response.data.suggestions[0];
    } catch (err) {
      Logger.error(err);
      return null;
    }
  }
}
