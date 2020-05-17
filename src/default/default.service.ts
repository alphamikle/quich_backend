import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from '~/bill/entities/bill.entity';
import { BillProvider } from '~/bill-provider/entities/bill-provider.entity';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { Category } from '~/category/entities/category.entity';
import { CategoryToUserRel } from '~/category/entities/category-to-user-rel.entity';
import { Product } from '~/product/entities/product.entity';
import { Purchase } from '~/purchase/entities/purchase.entity';
import { Shop } from '~/shop/entities/shop.entity';
import { FtsAccount } from '~/user/entities/fts-account.entity';
import { User } from '~/user/entities/user.entity';
import { ShopService } from '~/shop/shop.service';
import { BillService } from '~/bill/bill.service';
import { CategoryService } from '~/category/category.service';
import { PurchaseService } from '~/purchase/purchase.service';
import { ProductService } from '~/product/product.service';
import { UserService } from '~/user/user.service';
import { AllDataDto } from '~/default/dto/all-data.dto';
import { BillRequestService } from '~/bill-request/bill-request.service';
import { MessageService } from '~/message/message.service';

@Injectable()
export class DefaultService {
  constructor(
    @InjectRepository(Bill)
    private readonly billEntityRepository: Repository<Bill>,
    @InjectRepository(BillProvider)
    private readonly billProviderEntityRepository: Repository<BillProvider>,
    @InjectRepository(BillRequest)
    private readonly billRequestEntityRepository: Repository<BillRequest>,
    @InjectRepository(Category)
    private readonly categoryEntityRepository: Repository<Category>,
    @InjectRepository(CategoryToUserRel)
    private readonly categoryToUserEntityRepository: Repository<CategoryToUserRel>,
    @InjectRepository(Product)
    private readonly productEntityRepository: Repository<Product>,
    @InjectRepository(Purchase)
    private readonly purchaseEntityRepository: Repository<Purchase>,
    @InjectRepository(Shop)
    private readonly shopEntityRepository: Repository<Shop>,
    @InjectRepository(FtsAccount)
    private readonly ftsAccountEntityRepository: Repository<FtsAccount>,
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
    private readonly shopService: ShopService,
    private readonly billService: BillService,
    private readonly categoryService: CategoryService,
    private readonly purchaseService: PurchaseService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly billRequestService: BillRequestService,
    private readonly messageService: MessageService,
  ) {
  }

  async getAllUserData(userId: string): Promise<AllDataDto> {
    const bills = await this.billService.getUserBills(userId);
    const categories = await this.categoryService.getUserCategories(userId);
    const shops = await this.shopService.getUserShops(userId);
    const purchases = await this.purchaseService.getUserPurchases(userId);
    const products = await this.productService.getUserProducts(userId);
    const accounts = await this.userService.getFtsAccountsByUserId(userId);
    const billsRequests = await this.billRequestService.getUnloadedBillRequestsByUserId(userId);
    const unreadMessages = await this.messageService.getUnreadUserMessages(userId);
    const userQueries = await this.userService.getUserQueryUses(userId);
    let queries = 0;
    let queriesLimit = 2;
    if (userQueries) {
      queries = userQueries.queries;
      queriesLimit = userQueries.queryLimit;
    }
    return {
      bills,
      categories,
      shops,
      purchases,
      products,
      accounts,
      requests: billsRequests,
      messages: unreadMessages,
      queries,
      queriesLimit,
    };
  }

  async doServiceWork() {
    const trunc = (value: number) => Math.trunc(value * 100) / 100;
    const purchases = await this.purchaseEntityRepository.find();
    await Promise.all(purchases.map(async purchase => {
      purchase.price = trunc(purchase.price);
      return this.purchaseEntityRepository.save(purchase);
    }));
    const bills = await this.billEntityRepository.find();
    await Promise.all(bills.map(async bill => {
      bill.totalSum = trunc(bill.totalSum);
      return this.billEntityRepository.save(bill);
    }));
    const billRequests = await this.billRequestEntityRepository.find();
    await Promise.all(billRequests.map(async billRequest => {
      billRequest.totalSum = trunc(billRequest.totalSum);
      return this.billRequestEntityRepository.save(billRequest);
    }));
  }
}
