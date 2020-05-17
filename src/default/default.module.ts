import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultController } from '~/default/default.controller';
import { DefaultService } from '~/default/default.service';
import { Bill } from '~/bill/entities/bill.entity';
import { BillProvider } from '~/bill-provider/entities/bill-provider.entity';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { Category } from '~/category/entities/category.entity';
import { CategoryToUserRel } from '~/category/entities/category-to-user-rel.entity';
import { Product } from '~/product/entities/product.entity';
import { Purchase } from '~/purchase/entities/purchase.entity';
import { Shop } from '~/shop/entities/shop.entity';
import { FtsAccount } from '~/user/entities/fts-account.entity';
import { User } from '~/user/entities/user.entity';
import { ShopModule } from '~/shop/shop.module';
import { BillModule } from '~/bill/bill.module';
import { UserModule } from '~/user/user.module';
import { CategoryModule } from '~/category/category.module';
import { ProductModule } from '~/product/product.module';
import { PurchaseModule } from '~/purchase/purchase.module';
import { BillRequestModule } from '~/bill-request/bill-request.module';
import { MessageModule } from '~/message/message.module';

@Module({
  controllers: [
    DefaultController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Bill,
      BillProvider,
      BillRequest,
      Category,
      CategoryToUserRel,
      Product,
      Purchase,
      Shop,
      FtsAccount,
      User,
    ]),
    ShopModule,
    BillModule,
    UserModule,
    CategoryModule,
    ProductModule,
    PurchaseModule,
    BillRequestModule,
    MessageModule,
  ],
  providers: [
    DefaultService,
  ],
})
export class DefaultModule {
}
