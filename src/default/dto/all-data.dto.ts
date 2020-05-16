import 'reflect-metadata';
import { Bill } from '~/bill/entities/bill.entity';
import { Shop } from '~/shop/entities/shop.entity';
import { Purchase } from '~/purchase/entities/purchase.entity';
import { Product } from '~/product/entities/product.entity';
import { FtsAccount } from '~/user/entities/fts-account.entity';
import { CategoryDto } from '~/category/dto/category.dto';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { MessageEntity } from '~/message/entity/message.entity';
import * as defaultProto from '~/proto-generated/default';

export class AllDataDto implements defaultProto.AllDataDto {

  bills: Bill[];

  categories: CategoryDto[];

  shops: Shop[];

  purchases: Purchase[];

  products: Product[];

  accounts: FtsAccount[];

  requests: BillRequest[];

  messages: MessageEntity[];

  queries: number;

  queriesLimit: number;
}
