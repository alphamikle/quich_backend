// eslint-disable-next-line @typescript-eslint/camelcase
import { androidpublisher_v3 as v3 } from 'googleapis';
import { Sku } from '../entities/subscription.entity';
import * as user from '~/proto-generated/user';

export class GooglePlayProduct implements user.GooglePlayProduct {
  packageName: string;

  sku: Sku;

  status: 'active' | string;

  purchaseType: 'subscription' | string;

  defaultPrice: Price;

  prices: { [key: string]: Price };

  listings: Listings;

  defaultLanguage: string;

  subscriptionPeriod: string;

  trialPeriod: string;

  gracePeriod: string;

  static fromGoogleApi(data: v3.Schema$InAppProduct): GooglePlayProduct {
    const product = new GooglePlayProduct();
    product.subscriptionPeriod = data.subscriptionPeriod;
    product.defaultLanguage = data.defaultLanguage;
    product.defaultPrice = data.defaultPrice as Price;
    product.gracePeriod = data.gracePeriod;
    product.listings = data.listings as Listings;
    product.prices = data.prices as { [key: string]: Price };
    product.sku = data.sku as Sku;
    product.status = data.status;
    product.packageName = data.packageName;
    product.trialPeriod = data.trialPeriod;
    product.purchaseType = data.purchaseType;
    return product;
  }
}

export interface Price {
  priceMicros: string;
  currency: string;
}

export interface Listings {
  [languageCode: string]: LanguageContent;
}

export interface LanguageContent {
  title: string;
  description: string;
}
