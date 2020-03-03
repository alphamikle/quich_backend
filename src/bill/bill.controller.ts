import { BadRequestException, Body, Param }                                                                                from '@nestjs/common';
import { RequestUser }                                                                                                     from '../user/user.decorator';
import { UserEntity }                                                                                                      from '../user/entities/user.entity';
import { FtsQrDto }                                                                                                        from '../fts/dto/fts-qr.dto';
import { BillRequestService }                                                                                              from '../bill-request/bill-request.service';
import { FtsService }                                                                                                      from '../fts/fts.service';
import { UserService }                                                                                                     from '../user/user.service';
import { FtsAccountDto }                                                                                                   from '../fts/dto/fts-account.dto';
import { FtsTransformer }                                                                                                  from '../fts/fts.transformer';
import { BillDto }                                                                                                         from './dto/bill.dto';
import { OfdService }                                                                                                      from '../ofd/ofd.service';
import { ShopService }                                                                                                     from '../shop/shop.service';
import { PurchaseService }                                                                                                 from '../purchase/purchase.service';
import { BillService }                                                                                                     from './bill.service';
import { BillEntity }                                                                                                      from './entities/bill.entity';
import { ShopDto }                                                                                                         from '../shop/dto/shop.dto';
import { BILL_IS_BEEN_SAVED, FTS_UNKNOWN_FETCHING_ERROR, INVALID_ID_ERROR, INVALID_USER_ERROR, NOT_FOUND_FTS_ACCOUNT, OK } from '../helpers/text';
import { DateHelper }                                                                                                      from '../helpers/date.helper';
import { SecureDeleteAction, SecureGetAction, SecurePatchAction, SecurePostAction, TagController }                         from '../helpers/decorators';
import { SubscriptionValidator }                                                                                           from '../subscription/subscription.validator';

@TagController('bill')
export class BillController {
  private billRequestIdCache: Map<string, string> = new Map();

  constructor(
    private readonly billRequestService: BillRequestService,
    private readonly ftsService: FtsService,
    private readonly ftsTransformer: FtsTransformer,
    private readonly userService: UserService,
    private readonly ofdService: OfdService,
    private readonly shopService: ShopService,
    private readonly purchaseService: PurchaseService,
    private readonly billService: BillService,
    private readonly dateHelper: DateHelper,
    private readonly subscriptionValidator: SubscriptionValidator,
  ) {
  }

  @SecureGetAction('Получение списка чеков пользователя', [BillEntity])
  async getUserBills(@RequestUser() user: UserEntity): Promise<BillEntity[]> {
    return this.billService.getUserBills(user.id);
  }

  @SecurePostAction('Получение информации о чеке', BillDto, 'data')
  async getBillData(@RequestUser() user: UserEntity, @Body() ftsQrDto: FtsQrDto): Promise<BillDto> {
    this.validateLimits(user);
    const billData = await this.getBillDataFromFtsOrOfd(user, ftsQrDto);
    if (typeof billData === 'string') {
      throw new BadRequestException({ push: billData });
    }
    billData.shop = await this.extractShopDtoInfo(billData.shop);
    billData.purchases = await this.purchaseService.extractCategoriesIdsForPurchaseDtos({
      purchaseDtos: billData.purchases,
      userId: user.id,
    });
    const billRequestId = this.extractBillRequestIdFromCache({
      userId: user.id,
      ftsQrDto,
    });
    await this.billRequestService.setRawData({
      id: billRequestId,
      rawData: billData,
    });
    return billData;
  }

  @SecurePostAction('Получение информации о чеке по id BillRequest', BillDto, 'data/request/:requestId')
  async getBillDataByBillRequestId(@RequestUser() user: UserEntity, @Param('requestId') requestId: string): Promise<BillDto> {
    this.validateLimits(user);
    const billRequest = await this.billRequestService.getBillRequestById(requestId);
    if (!billRequest) {
      throw new BadRequestException({ push: INVALID_ID_ERROR });
    }
    if (billRequest.userId !== user.id) {
      throw new BadRequestException({ push: INVALID_USER_ERROR });
    }
    if (billRequest.isFetched && billRequest.rawData !== null) {
      return billRequest.rawData;
    }
    const ftsQrDto: FtsQrDto = {
      totalSum: billRequest.totalSum,
      dateTime: this.dateHelper.transformDateToFtsDate(billRequest.billDate),
      fiscalDocument: billRequest.fiscalDocument,
      fiscalNumber: billRequest.fiscalNumber,
      fiscalProp: billRequest.fiscalProp,
    };
    await this.billRequestService.incrementIterations(requestId);
    const billData = await this.getBillDataFromFtsOrOfd(user, ftsQrDto);
    if (typeof billData === 'string') {
      throw new BadRequestException({ push: billData });
    }
    billData.shop = await this.extractShopDtoInfo(billData.shop);
    billData.purchases = await this.purchaseService.extractCategoriesIdsForPurchaseDtos({
      purchaseDtos: billData.purchases,
      userId: user.id,
    });
    await this.billRequestService.setRawData({
      id: requestId,
      rawData: billData,
    });
    return billData;
  }

  @SecurePostAction('Создание формы чека', BillEntity)
  async createBill(@RequestUser() user: UserEntity, @Body() billDto: BillDto): Promise<BillEntity> {
    const shop = await this.shopService.findOrCreateShop(billDto.shop);
    const bill = await this.billService.createBillForUser({
      billDto,
      shopId: shop.id,
      userId: user.id,
    });
    // ? Пояснение:
    /** Избавился от Promise.all, потому что в одном чеке может
     * быть два продукта с одинаковым названием, но разной ценой
     * и сохранится только один из них
     */
    for await (const purchaseDto of billDto.purchases) {
      await this.purchaseService.createPurchase({
        purchaseDto,
        billId: bill.id,
      });
    }
    if (billDto.billRequestId) {
      await this.billRequestService.setBillIdToBillRequest({
        billRequestId: billDto.billRequestId,
        billId: bill.id,
      });
    }
    return bill;
  }

  @SecurePatchAction('Редактирование формы чека', BillEntity, ':billId')
  async editBill(@RequestUser() user: UserEntity, @Param('billId') billId: string, @Body() billDto: BillDto): Promise<BillEntity> {
    const billEntity = await this.billService.getBillById(billId);
    const shop = await this.shopService.editShop(billDto.shop);
    billDto.shop.id = shop.id;
    const editedBill = await this.billService.editBill({
      billDto,
      billEntity,
    });
    await this.purchaseService.editPurchases({
      purchases: billDto.purchases,
      billId: billDto.id,
    });
    return editedBill;
  }

  @SecureDeleteAction('Удаление чека', String, ':billId')
  async deleteBill(@RequestUser() user: UserEntity, @Param('billId') billId: string): Promise<string> {
    await this.billService.deleteBill(billId);
    return OK;
  }

  private async extractShopDtoInfo(shopDto: ShopDto): Promise<ShopDto> {
    const shop = await this.shopService.findOrCreateShop(shopDto);
    shopDto.id = shop.id;
    shopDto.title = shop.title;
    return shopDto;
  }

  private async getBillDataFromFtsOrOfd(user: UserEntity, ftsQrDto: FtsQrDto): Promise<string | BillDto> {
    const ftsPromise = this.getBillDataFromFts(user, ftsQrDto);
    const ofdPromise = this.ofdService.fetchBillData(ftsQrDto);
    const promiseArr = [
      ftsPromise,
      ofdPromise,
    ];
    const result = await Promise.race(promiseArr);
    if (result !== null && typeof result !== 'string') {
      await this.userService.incrementUserQueriesLimit({
        userId: user.id,
        accountId: null,
        qrDto: ftsQrDto,
      });
      return result;
    }
    const [billFromFts, billFromOfd] = await Promise.all(promiseArr);
    if (billFromOfd === null) {
      return billFromFts;
    }
    await this.userService.incrementUserQueriesLimit({
      userId: user.id,
      accountId: null,
      qrDto: ftsQrDto,
    });
    return billFromOfd;
  }

  private setBillRequestIdToCache({ userId, ftsQrDto, billRequestId }: { userId: string; ftsQrDto: FtsQrDto; billRequestId: string }) {
    this.billRequestIdCache.set(
      this.generateBillRequestCacheKey({
        userId,
        ftsQrDto,
      }),
      billRequestId,
    );
  }

  private extractBillRequestIdFromCache({ userId, ftsQrDto }: { userId: string; ftsQrDto: FtsQrDto; }) {
    const key = this.generateBillRequestCacheKey({
      userId,
      ftsQrDto,
    });
    const billRequestId = this.billRequestIdCache.get(key);
    this.billRequestIdCache.delete(key);
    return billRequestId;
  }

  private generateBillRequestCacheKey({ userId, ftsQrDto }: { userId: string; ftsQrDto: FtsQrDto }) {
    return `${userId}${ftsQrDto.fiscalProp}${ftsQrDto.fiscalNumber}${
      ftsQrDto.fiscalDocument
    }`;
  }

  private async getBillDataFromFts(user: UserEntity, ftsQrDto: FtsQrDto): Promise<string | BillDto> {
    const billRequest = await this.billRequestService.findOrCreateBillRequest({
      userId: user.id,
      ftsQrDto,
    });
    if (billRequest && billRequest.isFetched && billRequest.billId) {
      return BILL_IS_BEEN_SAVED;
    }
    const ftsAccount = await this.userService.getFtsAccountForUser(user.id);
    if (!ftsAccount) {
      // ? Ждем до получения чека от ОФД
      return NOT_FOUND_FTS_ACCOUNT;
    }
    let checkStatus = billRequest.isChecked;
    const ftsAccountDto = new FtsAccountDto(ftsAccount.phone, ftsAccount.password);
    if (!checkStatus) {
      checkStatus = await this.ftsService.checkBillExistence(ftsQrDto, ftsAccountDto);
    }
    if (checkStatus) {
      const billRequestId = billRequest.id;
      await this.billRequestService.makeBillRequestChecked(billRequestId);
      const billDataFromFts = await this.ftsService.fetchBillData(ftsQrDto, ftsAccountDto);
      if (typeof billDataFromFts !== 'string') {
        const billDto = this.ftsTransformer.transformFtsBillToBillDto(billDataFromFts);
        await Promise.all([
          this.billRequestService.makeBillRequestFetched(billRequestId),
          this.billRequestService.addFtsDataToBillRequest({
            billRequestId,
            ftsData: billDataFromFts,
          }),
          // ! TODO: С течением времени убедиться, что счетчик в ФНС увеличивается только на успешные попытки, а не на все подряд
          this.ftsService.incrementUsesOfFtsAccount(ftsAccount.phone),
          await this.userService.incrementUserQueriesLimit({
            userId: user.id,
            accountId: ftsAccount.id,
            qrDto: ftsQrDto,
          }),
        ]);
        this.setBillRequestIdToCache({
          userId: user.id,
          ftsQrDto,
          billRequestId: billRequest.id,
        });
        return billDto;
      }
      return billDataFromFts;
    }
    return FTS_UNKNOWN_FETCHING_ERROR;
  }

  private validateLimits(user: UserEntity): void {
    const validateResult = this.subscriptionValidator.validateUserUsingLimits(user);
    if (validateResult !== true) {
      throw new BadRequestException(validateResult);
    }
  }
}
