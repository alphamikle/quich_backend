import { BadRequestException, Body, Controller, forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { ApiUseTags }                                                                   from '@nestjs/swagger';
import { FTS_CHECKING_BILL_ERROR, FTS_NOT_CHECKED_BILL_ERROR, OK }                      from '../helpers/text';
import { FtsRegistrationDto }                                                           from './dto/fts-registration.dto';
import { FtsService }                                                                   from './fts.service';
import { FtsValidator }                                                                 from './fts.validator';
import { FtsRemindDto }                                                                 from './dto/fts-remind.dto';
import { FtsQrDto }                                                                     from './dto/fts-qr.dto';
import { RequestUser }                                                                  from '../user/user.decorator';
import { UserEntity }                                                                   from '../user/entities/user.entity';
import { UserService }                                                                  from '../user/user.service';
import { FtsAccountEntity }                                                             from '../user/entities/fts-account.entity';
import { BillRequestService }                                                           from '../bill-request/bill-request.service';
import { BillRequestEntity }                                                            from '../bill-request/entities/bill-request.entity';
import { FtsFetchResponseBill }                                                         from './dto/fts-fetch-response/bill.dto';
import { FtsTransformer }                                                               from './fts.transformer';
import { PostAction, SecurePostAction }                                                 from '../helpers/decorators';

@ApiUseTags('fts')
@Controller('fts')
export class FtsController {
  constructor(
    private readonly ftsService: FtsService,
    private readonly ftsValidator: FtsValidator,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly billRequestService: BillRequestService,
    private readonly ftsTransformer: FtsTransformer,
  ) {
  }

  @PostAction('Создание аккаунта ФНС', String, 'sign-up')
  async signUp(@Body() regDto: FtsRegistrationDto): Promise<string> {
    const validationInfo = this.ftsValidator.validateRegistrationDto(regDto);
    if (validationInfo !== true) {
      throw new BadRequestException(validationInfo);
    }
    const response = await this.ftsService.signUp(regDto);
    if (response !== true) {
      throw new BadRequestException({ push: response });
    }
    return OK;
  }

  @PostAction('Восстановление пароля от аккаунта ФНС', String, 'remind')
  async remindPassword(@Body() remindDto: FtsRemindDto): Promise<string> {
    const validationInfo = this.ftsValidator.validateRemindDto(remindDto);
    if (validationInfo !== true) {
      throw new BadRequestException(validationInfo);
    }
    const response = await this.ftsService.remindPassword(remindDto);
    if (response !== true) {
      throw new BadRequestException({ push: response });
    }
    return OK;
  }

  @SecurePostAction('Проверка существования чека в ФНС', String, 'bill/existence')
  async checkBillExistence(@RequestUser() user: UserEntity, @Body() ftsQrDto: FtsQrDto): Promise<string> {
    const { ftsAccount, billRequest } = await this.getFtsAccountAndBillRequest({
      userId: user.id,
      ftsQrDto,
    });
    if (billRequest.isChecked) {
      return OK;
    }
    await this.ftsService.assignBillRequestWithFtsAccount({
      ftsAccountId: ftsAccount.id,
      billRequestId: billRequest.id,
    });
    const response = await this.ftsService.checkBillExistence(ftsQrDto, {
      password: ftsAccount.password,
      phone: ftsAccount.phone,
    });
    if (!response) {
      throw new NotFoundException({ push: FTS_CHECKING_BILL_ERROR });
    }
    await this.billRequestService.makeBillRequestChecked(billRequest.id);
    return OK;
  }

  @SecurePostAction('Получение информации о чеке из ФНС', FtsFetchResponseBill, 'bill/data')
  async fetchBillData(@RequestUser() user: UserEntity, @Body() ftsQrDto: FtsQrDto): Promise<FtsFetchResponseBill> {
    const { fiscalProp, fiscalDocument, fiscalNumber } = ftsQrDto;
    const billRequest = await this.billRequestService.getBillRequestByProps({
      fiscalProp,
      fiscalDocument,
      fiscalNumber,
    });
    if (!billRequest) {
      throw new BadRequestException({ push: FTS_NOT_CHECKED_BILL_ERROR });
    }
    if (billRequest.isFetched) {
      return billRequest.ftsData;
    }
    const ftsAccountFromBillRequest = await this.ftsService.getBillRequestToFtsAccountEntityByBillRequestId(billRequest.id);
    const ftsAccount = await this.userService.getFtsAccountById(ftsAccountFromBillRequest.ftsAccountId);
    await this.ftsService.assignBillRequestWithFtsAccount({
      ftsAccountId: ftsAccount.id,
      billRequestId: billRequest.id,
    });
    const billData = await this.ftsService.fetchBillData(ftsQrDto, {
      password: ftsAccount.password,
      phone: ftsAccount.phone,
    });
    if (typeof billData !== 'string') {
      await this.billRequestService.makeBillRequestFetched(billRequest.id);
      await this.billRequestService.setRawData({
        id: billRequest.id,
        rawData: this.ftsTransformer.transformFtsBillToBillDto(billData),
      });
      await this.billRequestService.addFtsDataToBillRequest({
        billRequestId: billRequest.id,
        ftsData: billData,
      });
      return billData;
    }
    throw new NotFoundException({ push: billData }); // TODO: Коды ошибок от фнс и их проброс тут
  }

  private async getFtsAccountAndBillRequest({ userId, ftsQrDto }: { userId: string, ftsQrDto: FtsQrDto }): Promise<{ ftsAccount: FtsAccountEntity; billRequest: BillRequestEntity }> {
    const [ftsAccount, billRequest] = await Promise.all([
      this.userService.getFtsAccountForUser(userId),
      this.billRequestService.findOrCreateBillRequest({
        userId,
        ftsQrDto,
      }),
    ]);
    return {
      ftsAccount,
      billRequest,
    };
  }
}
