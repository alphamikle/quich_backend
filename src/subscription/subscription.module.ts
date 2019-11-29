import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionController } from './subscription.controller';

@Module({
  controllers: [ SubscriptionController ],
  imports: [ TypeOrmModule.forFeature([ SubscriptionEntity ]) ],
  providers: [ SubscriptionService ],
})
export class SubscriptionModule {
}
