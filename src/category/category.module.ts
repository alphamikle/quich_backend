import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { CategoryToUserEntity } from './entities/category-to-user.entity';
import { CategoryController } from './category.controller';
import { PurchaseModule } from '../purchase/purchase.module';

@Module({
  controllers: [ CategoryController ],
  imports: [ TypeOrmModule.forFeature([ CategoryEntity, PurchaseEntity, CategoryToUserEntity ]), PurchaseModule ],
  providers: [ CategoryService ],
  exports: [ CategoryService ],
})
export class CategoryModule {
}
