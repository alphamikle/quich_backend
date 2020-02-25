import 'reflect-metadata';
import { ApiModelProperty }  from '@nestjs/swagger';
import { BillEntity }        from '../../bill/entities/bill.entity';
import { ShopEntity }        from '../../shop/entities/shop.entity';
import { PurchaseEntity }    from '../../purchase/entities/purchase.entity';
import { ProductEntity }     from '../../product/entities/product.entity';
import { FtsAccountEntity }  from '../../user/entities/fts-account.entity';
import { CategoryDto }       from '../../category/dto/category.dto';
import { BillRequestEntity } from '../../bill-request/entities/bill-request.entity';
import { MessageEntity }     from '../../message/entity/message.entity';

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

  @ApiModelProperty({ type: [BillRequestEntity] })
  billsRequests: BillRequestEntity[];

  @ApiModelProperty({ type: [MessageEntity] })
  unreadMessages: MessageEntity[];

  @ApiModelProperty()
  queries: number;
}
