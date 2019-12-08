import { Sku, Status } from '../entities/subscription.entity';

export class GooglePlayDataDto {
  version!: string;

  packageName!: string;

  eventTimeMillis!: string;

  subscriptionNotification!: SubscriptionNotification;
}

export interface SubscriptionNotification {
  version: string;
  notificationType: Status;
  purchaseToken: string;
  subscriptionId: Sku;
}
