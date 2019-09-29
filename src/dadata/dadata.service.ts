import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosResponse, default as axios } from 'axios';
import { DadataResponse, Suggestion } from './dto/response.interface';

const { DADATA_TOKEN } = process.env;

@Injectable()
export class DadataService {
  private readonly api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/',
      headers: {
        Authorization: `Token ${DADATA_TOKEN}`,
      },
    });
  }

  async getShopInfoByTin(tin: string): Promise<Suggestion> {
    try {
      const response: AxiosResponse<DadataResponse> = await this.api.post('findById/party', {
        query: tin,
        branch_type: 'MAIN',
      });
      return response.data.suggestions[0];
    } catch (err) {
      console.error(err);
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
      console.error(err);
      return null;
    }
  }
}
