import { Module }            from '@nestjs/common';
import { TypeOrmModule }     from '@nestjs/typeorm';
import { BillService }       from './bill.service';
import { BillController }    from './bill.controller';
import { BillEntity }        from './entities/bill.entity';
import { ShopEntity }        from '../shop/entities/shop.entity';
import { UserEntity }        from '../user/entities/user.entity';
import { PurchaseEntity }    from '../purchase/entities/purchase.entity';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';
import { BillRequestModule } from '../bill-request/bill-request.module';
import { FtsModule }         from '../fts/fts.module';
import { UserModule }        from '../user/user.module';
import { OfdModule }         from '../ofd/ofd.module';
import { ShopModule }        from '../shop/shop.module';
import { PurchaseModule }    from '../purchase/purchase.module';
import { DateHelper }        from '../helpers/date.helper';

@Module({
  controllers: [BillController],
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
    OfdModule,
    ShopModule,
    PurchaseModule,
  ],
  providers: [
    BillService,
    DateHelper,
  ],
  exports: [BillService],
})
export class BillModule {
}
