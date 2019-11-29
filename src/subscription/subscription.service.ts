import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Market, Platform, SubscriptionEntity } from './entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GooglePlayHookDto } from './dto/google-play-hook.dto';

export interface CommonSubscriptionConstructorData {
  userId: string;
  activeFrom: Date;
  activeTo: Date;
  rawBody: GooglePlayHookDto;
}

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

  decodeGPHData(gphDto: GooglePlayHookDto): GooglePlayHookDto {
    const buffer = Buffer.from(gphDto.message.data, 'base64');
    gphDto.message.decodedData = JSON.parse(buffer.toString('utf8'));
    return gphDto;
  }

  private generateCommonSubscription({ userId, activeFrom, activeTo, rawBody }: CommonSubscriptionConstructorData) {
    const subscription = new SubscriptionEntity();
    subscription.userId = userId;
    subscription.subscriptionId = rawBody.message.messageId;
    subscription.activeFrom = activeFrom;
    subscription.activeTo = activeTo;
    subscription.rawBody = rawBody;
    return subscription;
  }

  generateAndroidSubscription({ userId, activeFrom, activeTo, rawBody }: CommonSubscriptionConstructorData) {
    const subscription = this.generateCommonSubscription({ userId, activeFrom, activeTo, rawBody });
    subscription.platform = Platform.ANDROID;
    subscription.market = Market.GOOGLE_PLAY;
    return subscription;
  }

  async createSubscription(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
    return await this.subscriptionRepository.save(subscription);
  }

  async pauseSubscriptionById(id: string): Promise<void> {
    await this.subscriptionRepository.update({ id }, { isActive: false });
  }

  async resumeSubscriptionById(id: string): Promise<void> {
    await this.subscriptionRepository.update({ id }, { isActive: true });
  }

  async hasUserActiveSubscriptionForPlatform({ userId, platform }: { userId: string, platform: Platform }) {
    const count = await this.subscriptionRepository.count({ where: { userId, isActive: true, platform } });
    return count > 0;
  }
}
