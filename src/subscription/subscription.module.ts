import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from '~/subscription/subscription.service';
import { Subscription } from '~/subscription/entities/subscription.entity';
import { SubscriptionController } from '~/subscription/subscription.controller';
import { GoogleApiService } from '~/subscription/google-api.service';
import { SubscriptionValidator } from '~/subscription/subscription.validator';

@Module({
  controllers: [
    SubscriptionController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Subscription,
    ]),
  ],
  providers: [
    SubscriptionService,
    GoogleApiService,
    SubscriptionValidator,
  ],
  exports: [
    SubscriptionService,
    SubscriptionValidator,
  ],
})
export class SubscriptionModule {
}
