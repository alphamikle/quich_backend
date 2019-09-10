import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from '../purchase/purchase/purchase.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ ProductEntity, PurchaseEntity ]) ],
  providers: [ ProductService ],
})
export class ProductModule {
}
