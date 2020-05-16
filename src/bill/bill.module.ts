import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { Bill } from './entities/bill';
import { ShopEntity } from '~/shop/entities/shop.entity';
import { User } from '~/user/entities/user';
import { PurchaseEntity } from '~/purchase/entities/purchase.entity';
import { BillRequestEntity } from '~/bill-request/entities/bill-request.entity';
import { BillRequestModule } from '~/bill-request/bill-request.module';
import { FtsModule } from '~/fts/fts.module';
import { UserModule } from '~/user/user.module';
import { OfdModule } from '~/ofd/ofd.module';
import { ShopModule } from '~/shop/shop.module';
import { PurchaseModule } from '~/purchase/purchase.module';
import { SubscriptionModule } from '~/subscription/subscription.module';
import { BillProviderModule } from '~/bill-provider/bill-provider.module';

@Module({
  controllers: [
    BillController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Bill,
      ShopEntity,
      User,
      PurchaseEntity,
      BillRequestEntity,
    ]),
    BillRequestModule,
    FtsModule,
    UserModule,
    OfdModule,
    ShopModule,
    PurchaseModule,
    SubscriptionModule,
    BillProviderModule,
  ],
  providers: [
    BillService,
  ],
  exports: [
    BillService,
  ],
})
export class BillModule {
}
