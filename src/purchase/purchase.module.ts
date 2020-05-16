import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { Purchase } from './entities/purchase.entity';
import { Product } from '../product/entities/product.entity';
import { Category } from '../category/entities/category.entity';
import { Bill } from '../bill/entities/bill.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Purchase,
      Product,
      Category,
      Bill,
    ]),
    ProductModule,
  ],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {
}
