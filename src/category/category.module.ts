import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { Category } from '~/category/entities/category.entity';
import { PurchaseEntity } from '~/purchase/entities/purchase.entity';
import { CategoryToUserRel } from '~/category/entities/category-to-user-rel.entity';
import { CategoryController } from '~/category/category.controller';
import { PurchaseModule } from '~/purchase/purchase.module';

@Module({
  controllers: [
    CategoryController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Category,
      PurchaseEntity,
      CategoryToUserRel,
    ]),
    PurchaseModule,
  ],
  providers: [
    CategoryService,
  ],
  exports: [
    CategoryService,
  ],
})
export class CategoryModule {
}
