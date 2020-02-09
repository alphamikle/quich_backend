import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillEntity } from '../bill/entities/bill.entity';
import { BillProviderEntity } from '../bill-provider/entities/bill-provider.entity';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryToUserEntity } from '../category/entities/category-to-user.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { ShopEntity } from '../shop/entities/shop.entity';
import { FtsAccountEntity } from '../user/entities/fts-account.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ShopService } from '../shop/shop.service';
import { BillService } from '../bill/bill.service';
import { CategoryService } from '../category/category.service';
import { PurchaseService } from '../purchase/purchase.service';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { AllUserDataDto } from './dto/AllUserData.dto';
import { BillRequestService } from '../bill-request/bill-request.service';
import { MessageService } from '../message/message.service';

@Injectable()
export class DefaultService {
  constructor(
    @InjectRepository(BillEntity)
    private readonly billEntityRepository: Repository<BillEntity>,
    @InjectRepository(BillProviderEntity)
    private readonly billProviderEntityRepository: Repository<BillProviderEntity>,
    @InjectRepository(BillRequestEntity)
    private readonly billRequestEntityRepository: Repository<BillRequestEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryEntityRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryToUserEntity)
    private readonly categoryToUserEntityRepository: Repository<CategoryToUserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseEntityRepository: Repository<PurchaseEntity>,
    @InjectRepository(ShopEntity)
    private readonly shopEntityRepository: Repository<ShopEntity>,
    @InjectRepository(FtsAccountEntity)
    private readonly ftsAccountEntityRepository: Repository<FtsAccountEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
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

  async getAllUserData(userId: string): Promise<AllUserDataDto> {
    const bills = await this.billService.getUserBills(userId);
    const categories = await this.categoryService.getUserCategories(userId);
    const shops = await this.shopService.getUserShops(userId);
    const purchases = await this.purchaseService.getUserPurchases(userId);
    const products = await this.productService.getUserProducts(userId);
    const accounts = await this.userService.getFtsAccountsByUserId(userId);
    const billsRequests = await this.billRequestService.getUnloadedBillRequestsByUserId(userId);
    const unreadMessages = await this.messageService.getUnreadUserMessages(userId);
    return { bills, categories, shops, purchases, products, accounts, billsRequests, unreadMessages };
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
