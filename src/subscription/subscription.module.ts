import { Module }                 from '@nestjs/common';
import { TypeOrmModule }          from '@nestjs/typeorm';
import { SubscriptionService }    from './subscription.service';
import { SubscriptionEntity }     from './entities/subscription.entity';
import { SubscriptionController } from './subscription.controller';
import { GoogleApiService }       from './google-api.service';
import { DateHelper }             from '../helpers/date.helper';
import { SubscriptionValidator }  from './subscription.validator';

@Module({
  controllers: [SubscriptionController],
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])],
  providers: [
    SubscriptionService,
    GoogleApiService,
    DateHelper,
    SubscriptionValidator,
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {
}
