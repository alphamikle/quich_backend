import { Metadata } from 'grpc';
/* eslint-disable */


export interface FtsAccount {
  id: string;
  phone: string;
}

export interface Accounts {
  accounts: FtsAccount[];
}

export interface FtsAccountDto {
  phone: string;
  password: string;
}

export interface FtsAccountModifyDto {
  password: string;
  phone: string;
}
