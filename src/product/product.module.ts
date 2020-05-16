import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Purchase } from '../purchase/entities/purchase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Purchase,
    ]),
  ],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {
}
