import { Metadata } from 'grpc';
/* eslint-disable */

export interface ShopDto {
  id?: string;
  title: string;
  tin: string;
  address: string;
}

export interface Shop {
  id: string;
  title: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  tin?: string;
}
