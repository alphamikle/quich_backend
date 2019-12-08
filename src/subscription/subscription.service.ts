import { Injectable } from '@nestjs/common';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Market, Platform, Status, SubscriptionEntity } from './entities/subscription.entity';
import { GooglePlayHookDto } from './dto/google-play-hook.dto';
import { GooglePlayDataDto } from './dto/google-play-data.dto';
import { DateHelper } from '../helpers/date.helper';
import { GooglePlayProduct } from './dto/google-play-product';
import { GooglePlaySubscriptionInfo } from './interface/google-api.interface';
import { SubscriptionInfoDto } from './dto/subscription-info.dto';

export interface CommonSubscriptionConstructorData {
  activeFrom: Date;
  activeTo: Date;
  hookRawBody: GooglePlayHookDto;
}

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  extractAdditionalData(hookDto: GooglePlayHookDto): GooglePlayHookDto {
    const buffer = Buffer.from(hookDto.message.data, 'base64');
    const googlePlayData: GooglePlayDataDto = JSON.parse(buffer.toString('utf8'));
    hookDto.message.decodedData = googlePlayData;
    hookDto.actionDate = new Date(Number.parseInt(googlePlayData.eventTimeMillis, 10));
    hookDto.status = googlePlayData.subscriptionNotification.notificationType;
    hookDto.sku = googlePlayData.subscriptionNotification.subscriptionId;
    return hookDto;
  }

  addEndDate({ hookDto, product }: { hookDto: GooglePlayHookDto, product: GooglePlayProduct }): GooglePlayHookDto {
    hookDto.endDate = this.dateHelper.addDurationFromGooglePlayPeriodString(product.subscriptionPeriod, hookDto.actionDate);
    return hookDto;
  }

  generateAndroidSubscription({ activeFrom, activeTo, hookRawBody }: CommonSubscriptionConstructorData) {
    const subscription = this.generateCommonSubscription({ activeFrom, activeTo, hookRawBody });
    subscription.platform = Platform.ANDROID;
    subscription.market = Market.GOOGLE_PLAY;
    return subscription;
  }

  async createSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
    return this.subscriptionRepository.save(subscription);
  }

  async pauseSubscriptionById(id: string): Promise<void> {
    await this.subscriptionRepository.update({ id }, { isActive: false });
  }

  async resumeSubscriptionById(id: string): Promise<void> {
    await this.subscriptionRepository.update({ id }, { isActive: true });
  }

  async hasUserActiveSubscriptionForPlatform({ userId, platform }: { userId: string, platform: Platform }): Promise<boolean> {
    const count = await this.subscriptionRepository.count({ where: { userId, isActive: true, platform } });
    return count > 0;
  }

  assignSubscriptionWithGooglePlaySubscriptionInfo({
    subscription,
    subscriptionInfo,
  }:
                                                     {
                                                       subscription: SubscriptionEntity,
                                                       subscriptionInfo: GooglePlaySubscriptionInfo,
                                                     }): SubscriptionEntity {
    subscription.orderId = subscriptionInfo.orderId;
    subscription.subscriptionInfoRawBody = subscriptionInfo;
    subscription.price = subscriptionInfo.priceAmountMicros;
    return subscription;
  }

  async getLastSubscriptionByPurchaseToken(purchaseToken: string): Promise<SubscriptionEntity> {
    return this.subscriptionRepository.findOne({ where: { purchaseToken }, order: { createdAt: 'DESC' } });
  }

  async isSubscriptionActiveAndBelongsToUser({ purchaseToken, userId }: { purchaseToken: string; userId: string }): Promise<boolean> {
    const lastSubscription = await this.getLastSubscriptionByPurchaseToken(purchaseToken);
    if (!lastSubscription) {
      return false;
    }
    return lastSubscription.isActive && lastSubscription.userId === userId;
  }

  async setUserFromOneSubscriptionToAllByToken(purchaseToken: string): Promise<void> {
    const subscriptionWithUser = await this.subscriptionRepository.findOne({ where: { purchaseToken, userId: Not(IsNull()) } });
    if (subscriptionWithUser) {
      await this.subscriptionRepository.update({ purchaseToken }, { userId: subscriptionWithUser.userId });
    }
  }

  async setUserIdToSubscriptionsByToken({ userId, purchaseToken }: { userId: string; purchaseToken: string }): Promise<void> {
    await this.subscriptionRepository.update({ purchaseToken }, { userId });
  }

  async getUserSubscriptionInfo(userId: string): Promise<SubscriptionInfoDto> {
    const userSubscriptions = await this.subscriptionRepository.find({ where: { userId, isActive: true, activeTo: MoreThan(new Date()) }, order: { activeTo: 'DESC' } });
    const activeSubscription = userSubscriptions.find((subscription) => {
      const { status } = subscription;
      return status === Status.SUBSCRIPTION_RENEWED || status === Status.SUBSCRIPTION_PURCHASED;
    });
    if (!activeSubscription) {
      return null;
    }
    const subscriptionInfo = new SubscriptionInfoDto();
    subscriptionInfo.activeFrom = activeSubscription.activeFrom;
    subscriptionInfo.activeTo = activeSubscription.activeTo;
    subscriptionInfo.isActive = activeSubscription.isActive;
    return subscriptionInfo;
  }

  private generateCommonSubscription({ activeFrom, activeTo, hookRawBody }: CommonSubscriptionConstructorData): SubscriptionEntity {
    const subscription = new SubscriptionEntity();
    subscription.price = 0;
    subscription.purchaseToken = hookRawBody.message.decodedData.subscriptionNotification.purchaseToken;
    subscription.activeFrom = activeFrom;
    subscription.activeTo = activeTo;
    subscription.hookRawBody = hookRawBody;
    subscription.status = hookRawBody.status;
    subscription.sku = hookRawBody.message.decodedData.subscriptionNotification.subscriptionId;
    return subscription;
  }
}
