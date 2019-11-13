import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { Guards } from '../helpers/guards';
import { RequestUser } from '../user/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { FtsQrDto } from '../fts/dto/fts-qr.dto';
import { BillRequestService } from '../bill-request/bill-request.service';
import { FtsService } from '../fts/fts.service';
import { UserService } from '../user/user.service';
import { FtsAccountDto } from '../fts/dto/fts-account.dto';
import { FtsTransformer } from '../fts/fts.transformer';
import { BillDto } from './dto/bill.dto';
import { OfdService } from '../ofd/ofd.service';
import { ShopService } from '../shop/shop.service';
import { PurchaseService } from '../purchase/purchase.service';
import { BillService } from './bill.service';
import { BillEntity } from './entities/bill.entity';
import { ShopDto } from '../shop/dto/shop.dto';
import { INVALID_ID_ERROR, INVALID_USER_ERROR, OK } from '../helpers/text';
import { DateHelper } from '../helpers/date.helper';

@ApiUseTags('bill')
@Controller('bill')
export class BillController {
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
  ) {
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ title: 'Получение списка чеков пользователя' })
  @ApiResponse({
    status: 201,
    type: BillEntity,
    isArray: true,
  })
  async getUserBills(@RequestUser() user: UserEntity): Promise<BillEntity[]> {
    return await this.billService.getUserBills(user.id);
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Post('data')
  @ApiOperation({ title: 'Получение информации о чеке' })
  @ApiResponse({
    status: 201,
    type: BillDto,
  })
  async getBillData(@RequestUser() user: UserEntity, @Body() ftsQrDto: FtsQrDto): Promise<BillDto> {
    const billData = await this.getBillDataFromFtsOrOfd(user, ftsQrDto);
    if (typeof billData === 'string') {
      throw new BadRequestException({ push: billData });
    }
    billData.shop = await this.extractShopDtoInfo(billData.shop);
    billData.purchases = await this.purchaseService.extractCategoriesIdsForPurchaseDtos(billData.purchases);
    return billData;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Post('data/request/:requestId')
  @ApiOperation({ title: 'Получение информации о чеке по id BillRequest' })
  @ApiResponse({
    status: 201,
    type: BillDto,
  })
  async getBillDataByBillRequestId(@RequestUser() user: UserEntity, @Param('requestId') requestId: string): Promise<BillDto> {
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
    billData.purchases = await this.purchaseService.extractCategoriesIdsForPurchaseDtos(billData.purchases);
    await this.billRequestService.setRawData({ id: requestId, rawData: billData });
    return billData;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ title: 'Создание формы чека' })
  @ApiResponse({
    status: 201,
    type: BillEntity,
  })
  async createBill(@RequestUser() user: UserEntity, @Body() billDto: BillDto): Promise<BillEntity> {
    console.log('Save bill', billDto);
    const shop = await this.shopService.findOrCreateShop(billDto.shop);
    const bill = await this.billService.createBillForUser({ billDto, shopId: shop.id, userId: user.id });
    await Promise.all(billDto.purchases.map(purchaseDto => this.purchaseService.createPurchase({ purchaseDto, billId: bill.id })));
    if (billDto.billRequestId) {
      await this.billRequestService.setBillIdToBillRequest({ billRequestId: billDto.billRequestId, billId: bill.id });
    }
    return bill;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Patch(':billId')
  @ApiOperation({ title: 'Редактирование формы чека' })
  @ApiResponse({
    status: 200,
    type: BillEntity,
  })
  async editBill(@RequestUser() user: UserEntity, @Param('billId') billId: string, @Body() billDto: BillDto): Promise<BillEntity> {
    const billEntity = await this.billService.getBillById(billId);
    const shop = await this.shopService.editShop(billDto.shop);
    billDto.shop.id = shop.id;
    const editedBill = await this.billService.editBill({ billDto, billEntity });
    await this.purchaseService.editPurchases({ purchases: billDto.purchases, billId: billDto.id });
    return editedBill;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Delete(':billId')
  @ApiOperation({ title: 'Удаление чека' })
  @ApiResponse({
    status: 200,
    type: String,
  })
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
      return result;
    }
    const [ billFromFts, billFromOfd ] = await Promise.all(promiseArr);
    if (billFromOfd === null && typeof billFromFts === 'string') {
      return billFromFts;
    } else if (billFromOfd !== null) {
      return billFromOfd;
    }
    return billFromFts;
  }

  private async getBillDataFromFts(user: UserEntity, ftsQrDto: FtsQrDto): Promise<string | BillDto> {
    const billRequest = await this.billRequestService.findOrCreateBillRequest({ userId: user.id, ftsQrDto });
    let ftsAccount = await this.userService.getNextFtsAccountByUserId(user.id);
    if (!ftsAccount) {
      ftsAccount = await this.userService.getRandomFtsAccount();
    }
    if (!ftsAccount) {
      // ? Ждем до получения чека от ОФД
    }
    await this.userService.addFtsAccountIdToQueue(ftsAccount.id);
    let checkStatus = billRequest.isChecked;
    const ftsAccountDto = new FtsAccountDto(ftsAccount.phone, ftsAccount.password);
    if (!checkStatus) {
      checkStatus = await this.ftsService.checkBillExistence(ftsQrDto, ftsAccountDto);
    }
    if (checkStatus || true) {
      const billRequestId = billRequest.id;
      await this.billRequestService.makeBillRequestChecked(billRequestId);
      const billDataFromFts = await this.ftsService.fetchBillData(ftsQrDto, ftsAccountDto);
      if (typeof billDataFromFts !== 'string') {
        const billDto = this.ftsTransformer.transformFtsBillToBillDto(billDataFromFts);
        await Promise.all([
          this.billRequestService.makeBillRequestFetched(billRequestId),
          this.billRequestService.addRawDataToBillRequest({ billRequestId, rawData: billDto }),
          this.billRequestService.addFtsDataToBillRequest({ billRequestId, ftsData: billDataFromFts }),
        ]);
        return billDto;
      } else {
        return billDataFromFts;
      }
    }
  }

}
