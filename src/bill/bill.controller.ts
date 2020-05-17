import { BadRequestException, Controller } from '@nestjs/common';
import { Metadata } from 'grpc';
import { User } from '~/user/entities/user.entity';
import { FtsQrDto } from '~/fts/dto/fts-qr.dto';
import { BillRequestService } from '~/bill-request/bill-request.service';
import { FtsService } from '~/fts/fts.service';
import { UserService } from '~/user/user.service';
import { FtsAccountDto } from '~/fts/dto/fts-account.dto';
import { FtsTransformer } from '~/fts/fts.transformer';
import { BillDto } from '~/bill/dto/bill.dto';
import { OfdService } from '~/ofd/ofd.service';
import { ShopService } from '~/shop/shop.service';
import { PurchaseService } from '~/purchase/purchase.service';
import { BillService } from '~/bill/bill.service';
import { Bill } from '~/bill/entities/bill.entity';
import { ShopDto } from '~/shop/dto/shop.dto';
import { BILL_IS_BEEN_SAVED, FTS_UNKNOWN_FETCHING_ERROR, INVALID_ID_ERROR, INVALID_USER_ERROR, NOT_FOUND_FTS_ACCOUNT } from '~/helpers/text';
import { DateHelper } from '~/helpers/date.helper';
import { SubscriptionValidator } from '~/subscription/subscription.validator';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { BillProviderService } from '~/bill-provider/bill-provider.service';
import { securedGrpc } from '~/providers/decorators';
import { Bills } from '~/bill/dto/bills.dto';
import * as bill from '~/proto-generated/bill';
import { Empty } from '~/providers/empty';
import { RequestIdDto } from '~/bill/dto/request-id.dto';
import { BillIdDto } from '~/bill/dto/bill-id.dto';
import { ProviderCode } from '~/bill-provider/entities/bill-provider.entity';

@Controller()
export class BillController implements bill.BillController {
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
    private readonly providerService: BillProviderService,
  ) {
  }

  @securedGrpc
  async getUserBills(request: Empty, { user }: Metadata): Promise<Bills> {
    return new Bills(await this.billService.getUserBills(user.id));
  }

  @securedGrpc
  async getBillData(request: FtsQrDto, { user }: Metadata): Promise<BillDto> {
    this.validateLimits(user);
    const billData = await this.getBillDataFromFtsOrOfd(user, request);
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
      ftsQrDto: request,
    });
    await this.billRequestService.setRawData({
      id: billRequestId,
      rawData: billData,
    });
    return billData;
  }

  @securedGrpc
  async getBillDataByBillRequestId({ requestId }: RequestIdDto, { user }: Metadata): Promise<BillDto> {
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
      ftsDateTime: this.dateHelper.transformDateToFtsDate(billRequest.billDate),
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

  @securedGrpc
  async createBill(request: BillDto, { user }: Metadata): Promise<Bill> {
    const shop = await this.shopService.findOrCreateShop(request.shop);
    const newBill = await this.billService.createBillForUser({
      billDto: request,
      shopId: shop.id,
      userId: user.id,
    });
    // ? Пояснение:
    /** Избавился от Promise.all, потому что в одном чеке может
     * быть два продукта с одинаковым названием, но разной ценой
     * и сохранится только один из них
     */
    for await (const purchaseDto of request.purchases) {
      await this.purchaseService.createPurchase({
        purchaseDto,
        billId: newBill.id,
      });
    }
    if (request.billRequestId) {
      await this.billRequestService.setBillIdToBillRequest({
        billRequestId: request.billRequestId,
        billId: newBill.id,
      });
    }
    return newBill;
  }

  @securedGrpc
  async editBill(request: BillDto, meta: Metadata): Promise<Bill> {
    const billEntity = await this.billService.getBillById(request.id);
    const shop = await this.shopService.editShop(request.shop);
    request.shop.id = shop.id;
    const editedBill = await this.billService.editBill({
      billDto: request,
      billEntity,
    });
    await this.purchaseService.editPurchases({
      purchases: request.purchases,
      billId: request.id,
    });
    return editedBill;
  }

  @securedGrpc
  async deleteBill({ billId }: BillIdDto, meta: Metadata): Promise<Empty> {
    await this.billService.deleteBill(billId);
    return new Empty();
  }

  private async extractShopDtoInfo(shopDto: ShopDto): Promise<ShopDto> {
    const shop = await this.shopService.findOrCreateShop(shopDto);
    shopDto.id = shop.id;
    shopDto.title = shop.title;
    return shopDto;
  }

  private async getBillDataFromFtsOrOfd(user: User, ftsQrDto: FtsQrDto): Promise<string | BillDto> {
    const billRequest = await this.billRequestService.findOrCreateBillRequest({
      userId: user.id,
      ftsQrDto,
    });
    if (billRequest && billRequest.isFetched && billRequest.billId) {
      return BILL_IS_BEEN_SAVED;
    }
    const ftsPromise = this.getBillDataFromFts(user, ftsQrDto, billRequest);
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
      await this.makeBillRequestFetched(billRequest.id, result.providerCode);
      return result;
    }
    const [billFromFts, billFromOfd] = await Promise.all(promiseArr);
    if (typeof billFromFts !== 'string' && billFromFts !== null) {
      await this.makeBillRequestFetched(billRequest.id, billFromFts.providerCode);
      return billFromFts;
    }
    if (typeof billFromOfd !== 'string' && billFromOfd !== null) {
      await this.userService.incrementUserQueriesLimit({
        userId: user.id,
        accountId: null,
        qrDto: ftsQrDto,
      });
      await this.makeBillRequestFetched(billRequest.id, billFromOfd.providerCode);
      return billFromOfd;
    }
    return 'Чек не найден в источниках';
  }

  private async makeBillRequestFetched(billRequestId: string, providerCode: ProviderCode): Promise<void> {
    const billProvider = await this.providerService.extractBillProvider(providerCode ?? ProviderCode.FTS);
    await this.billRequestService.makeBillRequestFetched(billRequestId, billProvider.id);
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
    return `${ userId }${ ftsQrDto.fiscalProp }${ ftsQrDto.fiscalNumber }${
      ftsQrDto.fiscalDocument
    }`;
  }

  private async getBillDataFromFts(user: User, ftsQrDto: FtsQrDto, billRequest: BillRequest): Promise<string | BillDto> {
    const ftsAccount = await this.userService.getFtsAccountForUser(user.id);
    if (!ftsAccount) {
      // ? Ждем до получения чека от ОФД
      return NOT_FOUND_FTS_ACCOUNT;
    }
    let checkStatus = billRequest.isChecked;
    const ftsAccountDto = new FtsAccountDto(ftsAccount.phone, ftsAccount.password);
    const newCheckStatus = await this.ftsService.checkBillExistence(ftsQrDto, ftsAccountDto);
    if (!checkStatus) {
      checkStatus = newCheckStatus;
    }
    if (checkStatus) {
      const billRequestId = billRequest.id;
      await this.billRequestService.makeBillRequestChecked(billRequestId);
      const billDataFromFts = await this.ftsService.fetchBillData(ftsQrDto, ftsAccountDto);
      if (typeof billDataFromFts !== 'string') {
        const billDto = this.ftsTransformer.transformFtsBillToBillDto(billDataFromFts);
        await Promise.all([
          this.billRequestService.addFtsDataToBillRequest({
            billRequestId,
            ftsData: billDataFromFts,
          }),
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

  private validateLimits(user: User): void {
    const validateResult = this.subscriptionValidator.validateUserUsingLimits(user);
    if (validateResult !== true) {
      throw new BadRequestException(validateResult);
    }
  }
}
