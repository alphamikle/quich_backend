import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { PurchaseEntity } from './entities/purchase.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { BillEntity } from '../bill/entities/bill.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ TypeOrmModule.forFeature([ PurchaseEntity, ProductEntity, CategoryEntity, BillEntity ]), ProductModule ],
  providers: [ PurchaseService ],
  exports: [ PurchaseService ],
})
export class PurchaseModule {
}
