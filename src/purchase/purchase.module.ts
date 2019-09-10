import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from './purchase/purchase.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { BillEntity } from '../bill/entities/bill.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ PurchaseEntity, ProductEntity, CategoryEntity, BillEntity ]) ],
  providers: [ PurchaseService ],
})
export class PurchaseModule {
}
