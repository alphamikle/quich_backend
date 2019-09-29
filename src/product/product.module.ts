import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ ProductEntity, PurchaseEntity ]) ],
  providers: [ ProductService ],
  exports: [ ProductService ],
})
export class ProductModule {
}
