import { Metadata } from 'grpc';
/* eslint-disable */

export interface PurchaseDto {
  id?: string;
  title: string;
  price: number;
  quantity: number;
  rate?: number;
  categoryId?: string;
}

export interface Purchase {
  id: string;
  price: number;
  quantity: number;
  rate?: number;
  productId: string;
  categoryId: string;
  billId: string;
  createdAt?: Date;
}
