import { Metadata } from 'grpc';
/* eslint-disable */
import { Empty } from './google/protobuf/empty';
import { Accounts, FtsAccountDto, FtsAccount, FtsAccountModifyDto } from './fts';


export interface PurchaseTokenDto {
  purchaseToken: string;
}

export interface SkuDto {
  sku: string;
  skuCode: SkuCode;
}

export interface GooglePlayProduct {
  packageName: string;
  sku: string;
  status: string;
  purchaseType: string;
  defaultPrice?: Price;
  prices: { [key: string]: Price };
  listings: { [key: string]: LanguageContent };
  defaultLanguage: string;
  subscriptionPeriod: string;
}

export interface GooglePlayProduct_PricesEntry {
  key: string;
  value?: Price;
}

export interface GooglePlayProduct_ListingsEntry {
  key: string;
  value?: LanguageContent;
}

export interface Price {
  priceMicros: string;
  currency: string;
}

export interface LanguageContent {
  title: string;
  description: string;
}

export interface GooglePlaySubscriptionInfo {
  startTimeMillis: number;
  expiryTimeMillis: number;
  autoResumeTimeMillis: number;
  autoRenewing: boolean;
  priceCurrencyCode: string;
  priceAmountMicros: number;
}

export interface UserCredentialsDto {
  email: string;
  password: string;
}

export interface EmailDto {
  email: string;
}

export interface PhoneDto {
  phone: string;
}

export interface TokenDto {
  token: string;
}

export interface SubscriptionController {

  addUserToSubscriptionData(request: PurchaseTokenDto, meta: Metadata): Promise<Empty>;

  getGooglePlayProductInfo(request: SkuDto, meta: Metadata): Promise<GooglePlayProduct>;

  getGooglePlaySubscriptionInfo(request: PurchaseTokenDto, meta: Metadata): Promise<GooglePlaySubscriptionInfo>;

}

export interface UserController {

  signUp(request: UserCredentialsDto, meta: Metadata): Promise<Empty>;

  restore(request: EmailDto, meta: Metadata): Promise<Empty>;

  signIn(request: UserCredentialsDto, meta: Metadata): Promise<TokenDto>;

  getFtsAccountsList(request: Empty, meta: Metadata): Promise<Accounts>;

  addFtsAccountToUser(request: FtsAccountDto, meta: Metadata): Promise<FtsAccount>;

  deleteFtsAccountFromUser(request: PhoneDto, meta: Metadata): Promise<Empty>;

  modifyFtsAccount(request: FtsAccountModifyDto, meta: Metadata): Promise<FtsAccount>;

  increaseQueryLimit(request: Empty, meta: Metadata): Promise<Empty>;

}

export const SkuCode = {
  COFFEE_CUP_SUBSCRIPTION: 0 as const,
  BREAKFAST_SUBSCRIPTION: 1 as const,
  KILO_BEEF_SUBSCRIPTION: 2 as const,
  UNRECOGNIZED: -1 as const,
}

export type SkuCode = 0 | 1 | 2 | -1;
