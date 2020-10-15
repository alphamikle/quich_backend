import { Metadata } from 'grpc';
/* eslint-disable */
import { Bill } from './export';
import { CategoryDto } from './category';
import { Shop } from './shop';
import { Purchase } from './purchase';
import { Product } from './product';
import { BillRequest } from './bill-request';
import { Message } from './message';
import { Empty } from './google/protobuf/empty';


export interface AllDataDto {
  bills: Bill[];
  categories: CategoryDto[];
  shops: Shop[];
  purchases: Purchase[];
  products: Product[];
  requests: BillRequest[];
  messages: Message[];
  queries: number;
  queriesLimit: number;
}

export interface DefaultController {

  serviceAction(request: Empty, meta: Metadata): Promise<Empty>;

  getAllUserData(request: Empty, meta: Metadata): Promise<AllDataDto>;

}
