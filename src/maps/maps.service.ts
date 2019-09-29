import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosResponse, default as axios } from 'axios';
import { GeocoderResponse } from './dto/response.interface';

const { YANDEX_TOKEN } = process.env;

@Injectable()
export class MapsService {
  private readonly api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://geocode-maps.yandex.ru/1.x/',
    });
  }

  async getCoordinatesByAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    try {
      const response: AxiosResponse<GeocoderResponse> = await this.api.get('',
        {
          params: {
            apikey: YANDEX_TOKEN,
            geocode: address,
            format: 'json',
          },
        },
      );
      const coordsString = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
      const [ latitude, longitude ] = coordsString.split(' ');
      return { latitude: Number(latitude), longitude: Number(longitude) };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
