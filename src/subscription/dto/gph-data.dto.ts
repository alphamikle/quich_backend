export class GphDataDto {
  version!: string;
  packageName!: string;
  eventTimeMillis!: string;
  subscriptionNotification!: SubscriptionNotification;
}

export interface SubscriptionNotification {
  version: string;
  notificationType: number;
  purchaseToken: string;
  subscriptionId: string;
}
