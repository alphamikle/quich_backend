import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartModel } from './models/cart.model';
import { Repository } from 'typeorm';
import { CartRequestModel } from './models/cartRequest.model';
import { CategoryModel } from './models/category.model';
import { FtsAccountModel } from './models/ftsAccount.model';
import { ProductModel } from './models/product.model';
import { PurchaseModel } from './models/purchase.model';
import { ScanModel } from './models/scan.model';
import { ShopModel } from './models/shop.model';
import { UserModel } from './models/user.model';
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
import { ShopDto } from '../shop/dto/shop.dto';
import { UNDEFINED_CATEGORY_TITLE } from '../helpers/text';
import { BillService } from '../bill/bill.service';
import { CategoryService } from '../category/category.service';
import { PurchaseService } from '../purchase/purchase.service';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { AllUserDataDto } from './dto/AllUserData.dto';
import { BillRequestService } from '../bill-request/bill-request.service';

@Injectable()
export class DefaultService {
  constructor(
    @InjectRepository(CartModel, 'oldDb')
    private readonly cartModelRepository: Repository<CartModel>,
    @InjectRepository(CartRequestModel, 'oldDb')
    private readonly cartRequestModelRepository: Repository<CartRequestModel>,
    @InjectRepository(CategoryModel, 'oldDb')
    private readonly categoryModelRepository: Repository<CategoryModel>,
    @InjectRepository(FtsAccountModel, 'oldDb')
    private readonly ftsAccountModelRepository: Repository<FtsAccountModel>,
    @InjectRepository(ProductModel, 'oldDb')
    private readonly productModelRepository: Repository<ProductModel>,
    @InjectRepository(PurchaseModel, 'oldDb')
    private readonly purchaseModelRepository: Repository<PurchaseModel>,
    @InjectRepository(ScanModel, 'oldDb')
    private readonly scanModelRepository: Repository<ScanModel>,
    @InjectRepository(ShopModel, 'oldDb')
    private readonly shopModelRepository: Repository<ShopModel>,
    @InjectRepository(UserModel, 'oldDb')
    private readonly userModelRepository: Repository<UserModel>,
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
    return { bills, categories, shops, purchases, products, accounts, billsRequests };
  }

  async importOldData() {
    const [
      carts,
      cartsRequests,
      categories,
      ftsAccounts,
      products,
      purchases,
      shops,
      users,
    ] = await Promise.all([
      this.cartModelRepository.find(),
      this.cartRequestModelRepository.find(),
      this.categoryModelRepository.find(),
      this.ftsAccountModelRepository.find(),
      this.productModelRepository.find(),
      this.purchaseModelRepository.find(),
      this.shopModelRepository.find(),
      this.userModelRepository.find(),
    ]);

    await this.billEntityRepository.delete({});
    await this.billRequestEntityRepository.delete({});
    await this.billProviderEntityRepository.delete({});
    await this.categoryToUserEntityRepository.delete({});
    await this.categoryEntityRepository.delete({});
    await this.productEntityRepository.delete({});
    await this.purchaseEntityRepository.delete({});
    await this.shopEntityRepository.delete({});
    await this.ftsAccountEntityRepository.delete({});
    await this.userEntityRepository.delete({});

    const usersMap: Map<number, UserEntity> = new Map();
    const ftsAccountsMap: Map<number, FtsAccountEntity> = new Map();
    const shopsMap: Map<number, ShopEntity> = new Map();
    const productsMap: Map<number, ProductEntity> = new Map();
    const productsByTitlesMap: Map<string, ProductEntity> = new Map();
    const oldProductsMap: Map<number, ProductModel> = new Map();
    const categoriesMap: Map<number, CategoryEntity> = new Map();
    const categoriesToUsersMap: Map<number, CategoryToUserEntity> = new Map();
    const billMap: Map<number, BillEntity> = new Map();
    const purchaseMap: Map<number, PurchaseEntity> = new Map();

    let ftsProvider = new BillProviderEntity();
    ftsProvider.title = BillProviderEntity.FTS;
    ftsProvider = await this.billProviderEntityRepository.save(ftsProvider);

    let undefinedCategory = new CategoryEntity();
    undefinedCategory.title = UNDEFINED_CATEGORY_TITLE;
    undefinedCategory = await this.categoryEntityRepository.save(undefinedCategory);

    console.time('Users');
    for (const user of users) {
      let newUser = new UserEntity();
      newUser.password = user.password;
      newUser.email = user.email;
      newUser = await this.userEntityRepository.save(newUser);
      usersMap.set(user.id, newUser);

      const undefinedCategoryToUser = new CategoryToUserEntity();
      undefinedCategoryToUser.categoryId = undefinedCategory.id;
      undefinedCategoryToUser.userId = newUser.id;
      undefinedCategoryToUser.color = CategoryToUserEntity.BLACK_COLOR;
      await this.categoryToUserEntityRepository.save(undefinedCategoryToUser);
    }
    console.timeEnd('Users');

    console.time('Fts accounts');
    for (const ftsAccount of ftsAccounts) {
      let newAccount = new FtsAccountEntity();
      newAccount.password = ftsAccount.password;
      newAccount.phone = ftsAccount.phone;
      newAccount.userId = usersMap.get(ftsAccount.userId).id;
      newAccount = await this.ftsAccountEntityRepository.save(newAccount);
      ftsAccountsMap.set(ftsAccount.id, newAccount);
    }
    console.timeEnd('Fts accounts');

    console.time('Shops');
    for (const shop of shops) {
      if (shopsMap.has(shop.id)) {
        continue;
      }
      const shopDto = new ShopDto();
      shopDto.title = shop.title.trim().toUpperCase();
      shopDto.address = shop.address;
      shopDto.tin = shop.userInn ? shop.userInn.trim() : null;
      if (shopDto.tin) {
        shopDto.title = null;
      }
      const newShop = await this.shopService.findOrCreateShop(shopDto);
      shopsMap.set(shop.id, newShop);
    }
    console.timeEnd('Shops');

    console.time('Products');
    for (const product of products) {
      oldProductsMap.set(product.id, product);
      const title = product.title.trim().toUpperCase();
      if (productsByTitlesMap.has(title)) {
        productsMap.set(product.id, productsByTitlesMap.get(title));
      } else {
        let newProduct = new ProductEntity();
        newProduct.title = title;
        newProduct = await this.productEntityRepository.save(newProduct);
        productsMap.set(product.id, newProduct);
        productsByTitlesMap.set(newProduct.title, newProduct);
      }
    }
    console.timeEnd('Products');

    console.time('Categories');
    for (const category of categories) {
      if (categoriesMap.has(category.id)) {
        continue;
      }
      let newCategory = new CategoryEntity();
      newCategory.title = category.title.trim().toUpperCase();
      newCategory = await this.categoryEntityRepository.save(newCategory);
      categoriesMap.set(category.id, newCategory);
      let newCategoryToUser = new CategoryToUserEntity();
      newCategoryToUser.categoryId = newCategory.id;
      newCategoryToUser.color = category.color;
      newCategoryToUser.userId = usersMap.get(category.userId).id;
      newCategoryToUser = await this.categoryToUserEntityRepository.save(newCategoryToUser);
      categoriesToUsersMap.set(category.id, newCategoryToUser);
    }
    console.timeEnd('Categories');

    console.time('Carts');
    for (const cart of carts) {
      let newBill = new BillEntity();
      newBill.shopId = shopsMap.get(cart.shopId).id;
      newBill.billDate = cart.checkDate;
      newBill.comment = cart.comment;
      newBill.totalSum = Math.trunc(cart.sumTotal * 100) / 100;
      newBill.userId = usersMap.get(cart.userId).id;
      newBill = await this.billEntityRepository.save(newBill);
      billMap.set(cart.id, newBill);
    }
    console.timeEnd('Carts');

    console.time('Purchases');
    for (const purchase of purchases) {
      let newPurchase = new PurchaseEntity();
      const oldCategoryId = oldProductsMap.get(purchase.productId).categoryId;
      if (!oldCategoryId) {
        newPurchase.categoryId = undefinedCategory.id;
      } else {
        const category = categoriesMap.get(oldCategoryId);
        newPurchase.categoryId = category ? category.id : undefinedCategory.id;
      }
      newPurchase.quantity = purchase.quantity;
      newPurchase.price = Math.trunc(purchase.price * 100) / 100;
      newPurchase.productId = productsMap.get(purchase.productId).id;
      newPurchase.billId = billMap.get(purchase.checkId).id;
      newPurchase.rate = purchase.rating;
      newPurchase.createdAt = purchase.createdAt;
      newPurchase = await this.purchaseEntityRepository.save(newPurchase);
      purchaseMap.set(purchase.id, newPurchase);
    }
    console.timeEnd('Purchases');

    console.time('Requests');
    for (const cartsRequest of cartsRequests) {
      let newBillRequest = new BillRequestEntity();
      const bill = billMap.get(cartsRequest.cartId);
      newBillRequest.billId = bill ? bill.id : null;
      newBillRequest.billDate = cartsRequest.cartDate;
      newBillRequest.billProviderId = ftsProvider.id;
      newBillRequest.fiscalDocument = cartsRequest.fiscalDocument;
      newBillRequest.fiscalNumber = cartsRequest.fiscalNumber;
      newBillRequest.fiscalProp = cartsRequest.fiscalProp;
      newBillRequest.isChecked = true;
      newBillRequest.isFetched = cartsRequest.isFetched;
      newBillRequest.totalSum = cartsRequest.cartSum;
      newBillRequest.userId = usersMap.get(cartsRequest.userId).id;
      // newBillRequest.rawData = cartsRequest.cartResult;
      newBillRequest = await this.billRequestEntityRepository.save(newBillRequest);
    }
    console.timeEnd('Requests');

    return { usersMap, ftsAccountsMap, shopsMap, productsMap, categoriesMap, categoriesToUsersMap, billMap, purchaseMap };
  }
}
