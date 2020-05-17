import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/camelcase
import { androidpublisher_v3, google } from 'googleapis';
// eslint-disable-next-line import/no-extraneous-dependencies
import { JWT, JWTInput } from 'google-auth-library';
import { readFileSync } from 'fs';
import { GooglePlayProduct } from '~/subscription/dto/google-play-product';
import { Sku } from '~/subscription/entities/subscription.entity';
import { GooglePlaySubscriptionInfo } from '~/subscription/interface/google-api.interface';

// eslint-disable-next-line @typescript-eslint/camelcase
import AndroidPublisher = androidpublisher_v3.Androidpublisher;

const { GOOGLE_API_CREDENTIALS_PATH, APP_PACKAGE_NAME } = process.env;

@Injectable()
export class GoogleApiService {
  private readonly publisher: AndroidPublisher;

  private readonly credentials: JWTInput;

  private readonly jwt: JWT;

  private readonly packageName: string;

  private products: Map<string, GooglePlayProduct> = new Map();

  constructor() {
    this.packageName = APP_PACKAGE_NAME;
    this.publisher = google.androidpublisher('v3');
    this.credentials = JSON.parse(readFileSync(GOOGLE_API_CREDENTIALS_PATH)
      .toString('utf8'));
    const jwt = new JWT();
    jwt.fromJSON(this.credentials);
    jwt.scopes = ['https://www.googleapis.com/auth/androidpublisher'];
    this.jwt = jwt;
  }

  async getAllProductsData() {
    const products: Array<Promise<GooglePlayProduct>> = [];
    const skuValues: Sku[] = Object.values(Sku);
    for (const sku of skuValues) {
      products.push(this.getProductInfoBySku(sku));
    }
    await Promise.all(products);
  }

  async getProductInfoBySku(sku: Sku): Promise<GooglePlayProduct> {
    if (!this.products.has(sku)) {
      const response = await this.publisher.inappproducts.get({
        auth: this.jwt,
        packageName: this.packageName,
        sku,
      });
      this.products.set(sku, GooglePlayProduct.fromGoogleApi(response.data));
    }
    return this.products.get(sku);
  }

  async getSubscriptionInfo({ token }: { token: string }): Promise<GooglePlaySubscriptionInfo> {
    const response = await this.publisher.purchases.subscriptions.get({
      auth: this.jwt,
      packageName: this.packageName,
      token,
    });
    const { data } = response;
    const transformedData = data as unknown as GooglePlaySubscriptionInfo;
    transformedData.startTimeMillis = Number.parseInt(data.startTimeMillis, 10);
    transformedData.expiryTimeMillis = Number.parseInt(data.expiryTimeMillis, 10);
    transformedData.autoResumeTimeMillis = data.autoResumeTimeMillis ?
      Number.parseInt(data.autoResumeTimeMillis, 10) :
      undefined;
    transformedData.priceAmountMicros = Number.parseInt(data.priceAmountMicros, 10);
    transformedData.userCancellationTimeMillis = data.userCancellationTimeMillis ?
      Number.parseInt(data.userCancellationTimeMillis, 10) :
      undefined;
    return transformedData;
  }
}
