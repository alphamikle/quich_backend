import { BillEntity } from '../../bill/entities/bill.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { ShopEntity } from '../../shop/entities/shop.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { FtsAccountEntity } from '../../user/entities/fts-account.entity';
import { CategoryDto } from '../../category/dto/category.dto';

export class AllUserDataDto {
  @ApiModelProperty({ type: [BillEntity] })
  bills: BillEntity[];
  @ApiModelProperty({ type: [CategoryDto] })
  categories: CategoryDto[];
  @ApiModelProperty({ type: [ShopEntity] })
  shops: ShopEntity[];
  @ApiModelProperty({ type: [PurchaseEntity] })
  purchases: PurchaseEntity[];
  @ApiModelProperty({ type: [ProductEntity] })
  products: ProductEntity[];
  @ApiModelProperty({ type: [FtsAccountEntity] })
  accounts: FtsAccountEntity[];
}
