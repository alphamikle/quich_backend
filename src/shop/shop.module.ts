import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopEntity } from './entities/shop.entity';
import { BillEntity } from '../bill/entities/bill.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ ShopEntity, BillEntity ]) ],
  providers: [ ShopService ],
})
export class ShopModule {
}
