import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillEntity } from './entities/bill.entity';
import { ShopEntity } from '../shop/entities/shop.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PurchaseEntity } from '../purchase/purchase/purchase.entity';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';

@Module({
  controllers: [ BillController ],
  imports: [ TypeOrmModule.forFeature([ BillEntity, ShopEntity, UserEntity, PurchaseEntity, BillRequestEntity ]) ],
  providers: [ BillService ],
})
export class BillModule {
}
