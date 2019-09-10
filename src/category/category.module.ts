import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { PurchaseEntity } from '../purchase/purchase/purchase.entity';
import { CategoryToUserEntity } from './entities/category-to-user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ CategoryEntity, PurchaseEntity, CategoryToUserEntity ]) ],
  providers: [ CategoryService ],
})
export class CategoryModule {
}
