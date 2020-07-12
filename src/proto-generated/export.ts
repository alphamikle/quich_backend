import { Metadata } from 'grpc';
/* eslint-disable */

export interface Bill {
  id: string;
  comment?: string;
  totalSum: number;
  billDate?: Date;
  shopId: string;
  userId: string;
}
