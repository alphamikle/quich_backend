export interface GooglePlaySubscriptionInfo {
  startTimeMillis: number;
  expiryTimeMillis: number;
  autoResumeTimeMillis: number;
  autoRenewing: boolean;
  priceCurrencyCode: string;
  priceAmountMicros: number; // ? Need to divide by 10000 to get cents (89.00 === 89000000)
  introductoryPriceInfo?: { // ? Must been only at intro subscriptions (period with a lower price, but not free)
    introductoryPriceCurrencyCode: string;
    introductoryPriceAmountMicros: number;
    introductoryPricePeriod: string;
    introductoryPriceCycles: number;
  };
  countryCode: string;
  developerPayload: string;
  paymentState?: GooglePlayPurchasePaymentState;
  cancelReason?: GooglePlayPurchaseCancelReason;
  userCancellationTimeMillis: number;
  cancelSurveyResult?: {
    cancelSurveyReason: GooglePlayPurchaseCancelSurveyReason;
    userInputCancelReason?: string;
  };
  orderId: string;
  linkedPurchaseToken?: string;
  acknowledgementState: GooglePlayPurchaseAcknowledgementState;
}

export enum GooglePlayPurchasePaymentState {
  PAYMENT_PENDING,
  RECEIVED,
  TRIAL,
  UP_DOWNGRADE_PENDING,
}

export enum GooglePlayPurchaseCancelReason {
  USER_CANCEL,
  SYSTEM_CANCEL,
  REPLACE_WITH_NEW_SUBSCRIPTION,
  DEVELOPER_CANCEL,
}

export enum GooglePlayPurchaseCancelSurveyReason {
  OTHER,
  DONT_USE_SERVICE,
  TECHNICAL_PROBLEMS,
  PRICE_PROBLEMS,
  FOUND_BETTER_APP,
}

export enum GooglePlayPurchaseAcknowledgementState {
  YET_TO_BE_ACKNOWLEDGED,
  ACKNOWLEDGED,
}
