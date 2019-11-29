import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Platform, SubscriptionEntity } from './entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {}

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
