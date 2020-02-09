import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultController } from './default.controller';
import { DefaultService } from './default.service';
import { BillEntity } from '../bill/entities/bill.entity';
import { BillProviderEntity } from '../bill-provider/entities/bill-provider.entity';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryToUserEntity } from '../category/entities/category-to-user.entity';
import { FtsAccountToBillRequestEntity } from '../fts/entities/fts-account-to-bill-request.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { ShopEntity } from '../shop/entities/shop.entity';
import { FtsAccountEntity } from '../user/entities/fts-account.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ShopModule } from '../shop/shop.module';
import { BillModule } from '../bill/bill.module';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { BillRequestModule } from '../bill-request/bill-request.module';
import { MessageModule } from '../message/message.module';

@Module({
  controllers: [ DefaultController ],
  imports: [
    TypeOrmModule.forFeature([
      BillEntity,
      BillProviderEntity,
      BillRequestEntity,
      CategoryEntity,
      CategoryToUserEntity,
      FtsAccountToBillRequestEntity,
      ProductEntity,
      PurchaseEntity,
      ShopEntity,
      FtsAccountEntity,
      UserEntity,
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
  providers: [ DefaultService ],
})
export class DefaultModule {
}
