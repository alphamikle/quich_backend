import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillEntity } from './entities/bill.entity';
import { ShopEntity } from '../shop/entities/shop.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';
import { BillRequestModule } from '../bill-request/bill-request.module';
import { FtsModule } from '../fts/fts.module';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ BillController ],
  imports: [
    TypeOrmModule.forFeature([
      BillEntity,
      ShopEntity,
      UserEntity,
      PurchaseEntity,
      BillRequestEntity,
    ]),
    BillRequestModule,
    FtsModule,
    UserModule,
  ],
  providers: [ BillService ],
})
export class BillModule {
}
