import { BadRequestException, Body, Controller, forwardRef, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { wrapErrors } from '../helpers/response.helper';
import { FTS_ACCOUNTS_ALL_BUSY_ERROR, OK } from '../helpers/text';
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
    const hasUserFtsAccount = await this.userService.hasUserFtsAccount(user.id);
    let ftsAccount: FtsAccountEntity;
    if (hasUserFtsAccount) {
      ftsAccount = await this.userService.getNextFtsAccountByUserId(user.id);
    } else {
      ftsAccount = await this.userService.getRandomFtsAccount();
    }
    if (!ftsAccount) {
      throw new BadRequestException(wrapErrors({ push: FTS_ACCOUNTS_ALL_BUSY_ERROR }));
    }
    await this.userService.addFtsAccountIdToQueue(ftsAccount.id);
    let billRequest = await this.billRequestService.getBillRequestByProps({
      fiscalNumber: ftsQrDto.fiscalNumber,
      fiscalDocument: ftsQrDto.fiscalDocument,
      fiscalProp: ftsQrDto.fiscalProp,
    });
    if (!billRequest) {
      billRequest = await this.billRequestService.createBillRequest({
        userId: user.id,
        billDate: ftsQrDto.dateTime,
        totalSum: ftsQrDto.totalSum,
        fiscalProp: ftsQrDto.fiscalProp,
        fiscalNumber: ftsQrDto.fiscalNumber,
        fiscalDocument: ftsQrDto.fiscalDocument,
      });
    }
    await this.ftsService.assignBillRequestWithFtsAccount({ ftsAccountId: ftsAccount.id, billRequestId: billRequest.id });
    const response = await this.ftsService.checkBillExistence(ftsQrDto, { password: ftsAccount.password, phone: ftsAccount.phone });
    return OK;
  }
}
