import { BadRequestException, Body, Controller, forwardRef, Inject, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { wrapErrors } from '../helpers/response.helper';
import { FTS_CHECKING_BILL_ERROR, FTS_NOT_CHECKED_BILL_ERROR, OK } from '../helpers/text';
import { FtsRegistrationDto } from './dto/fts-registration.dto';
import { FtsService } from './fts.service';
import { FtsValidator } from './fts.validator';
import { FtsRemindDto } from './dto/fts-remind.dto';
import { FtsQrDto } from './dto/fts-qr.dto';
import { Guards } from '../helpers/guards';
import { RequestUser } from '../user/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { FtsAccountEntity } from '../user/entities/fts-account.entity';
import { BillRequestService } from '../bill-request/bill-request.service';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';
import { FtsFetchResponseBill } from './dto/fts-fetch-response/bill.dto';

@ApiUseTags('fts')
@Controller('fts')
export class FtsController {
  constructor(
    private readonly ftsService: FtsService,
    private readonly ftsValidator: FtsValidator,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly billRequestService: BillRequestService,
  ) {
  }

  @Post('sign-up')
  @ApiOperation({ title: 'Создание аккаунта ФНС' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async signUp(@Body() regDto: FtsRegistrationDto): Promise<string> {
    const validationInfo = this.ftsValidator.validateRegistrationDto(regDto);
    if (validationInfo !== true) {
      throw new BadRequestException(wrapErrors(validationInfo));
    }
    const response = await this.ftsService.signUp(regDto);
    if (response !== true) {
      throw new BadRequestException(wrapErrors({ push: response }));
    }
    return OK;
  }

  @Post('remind')
  @ApiOperation({ title: 'Восстановление пароля от аккаунта ФНС' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async remindPassword(@Body() remindDto: FtsRemindDto): Promise<string> {
    const validationInfo = this.ftsValidator.validateRemindDto(remindDto);
    if (validationInfo !== true) {
      throw new BadRequestException(wrapErrors(validationInfo));
    }
    const response = await this.ftsService.remindPassword(remindDto);
    if (response !== true) {
      throw new BadRequestException(wrapErrors({ push: response }));
    }
    return OK;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Post('bill/existence')
  @ApiOperation({ title: 'Проверка существования чека в ФНС' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async checkBillExistence(@RequestUser() user: UserEntity, @Body() ftsQrDto: FtsQrDto): Promise<string> {
    const { ftsAccount, billRequest } = await this.getFtsAccountAndBillRequest({ userId: user.id, ftsQrDto });
    if (billRequest.isChecked) {
      return OK;
    }
    await this.ftsService.assignBillRequestWithFtsAccount({ ftsAccountId: ftsAccount.id, billRequestId: billRequest.id });
    const response = await this.ftsService.checkBillExistence(ftsQrDto, { password: ftsAccount.password, phone: ftsAccount.phone });
    if (!response) {
      throw new NotFoundException(wrapErrors({ push: FTS_CHECKING_BILL_ERROR }));
    }
    await this.billRequestService.makeBillRequestChecked(billRequest.id);
    return OK;
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Post('bill/data')
  @ApiOperation({ title: 'Получение информации о чеке из ФНС' })
  @ApiResponse({
    status: 201,
    type: FtsFetchResponseBill,
  })
  async fetchBillData(@RequestUser() user: UserEntity, @Body() ftsQrDto: FtsQrDto): Promise<FtsFetchResponseBill> {
    const { fiscalProp, fiscalDocument, fiscalNumber } = ftsQrDto;
    const billRequest = await this.billRequestService.getBillRequestByProps({ fiscalProp, fiscalDocument, fiscalNumber });
    if (!billRequest) {
      throw new BadRequestException(wrapErrors({ push: FTS_NOT_CHECKED_BILL_ERROR }));
    }
    if (billRequest.isFetched) {
      return billRequest.rawData;
    }
    const ftsAccountFromBillRequest = await this.ftsService.getBillRequestToFtsAccountEntityByBillRequestId(billRequest.id);
    const ftsAccount = await this.userService.getFtsAccountById(ftsAccountFromBillRequest.ftsAccountId);
    await this.ftsService.assignBillRequestWithFtsAccount({ ftsAccountId: ftsAccount.id, billRequestId: billRequest.id });
    const billData = await this.ftsService.fetchBillData(ftsQrDto, { password: ftsAccount.password, phone: ftsAccount.phone });
    if (typeof billData !== 'string') {
      await this.billRequestService.makeBillRequestFetched(billRequest.id);
      await this.billRequestService.addRawDataToBillRequest({ billRequestId: billRequest.id, rawData: billData });
      return billData;
    }
    throw new NotFoundException(wrapErrors({ push: billData })); // TODO: Коды ошибок от фнс и их проброс тут
  }

  private async getFtsAccountAndBillRequest({ userId, ftsQrDto }:
                                              { userId: string, ftsQrDto: FtsQrDto }):
    Promise<{ ftsAccount: FtsAccountEntity; billRequest: BillRequestEntity }> {
    const [ ftsAccount, billRequest ] = await Promise.all([
      this.userService.getFtsAccountForUser(userId),
      this.billRequestService.findOrCreateBillRequest({ userId, ftsQrDto }),
    ]);
    return { ftsAccount, billRequest };
  }
}
