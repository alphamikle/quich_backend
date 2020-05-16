import 'reflect-metadata';
import { Bill } from '../../bill/entities/bill';
import { ShopEntity } from '../../shop/entities/shop.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import { FtsAccountEntity } from '../../user/entities/fts-account.entity';
import { CategoryDto } from '../../category/dto/category.dto';
import { BillRequestEntity } from '../../bill-request/entities/bill-request.entity';
import { MessageEntity } from '../../message/entity/message.entity';

export class AllUserDataDto {

  bills: Bill[];


  categories: CategoryDto[];


  shops: ShopEntity[];


  purchases: PurchaseEntity[];


  products: ProductEntity[];


  accounts: FtsAccountEntity[];


  billsRequests: BillRequestEntity[];


  unreadMessages: MessageEntity[];


  queries: number;


  queriesLimit: number;
}
