import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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

@ApiUseTags('bill')
@Controller('bill')
export class BillController {
  constructor(
    private readonly billRequestService: BillRequestService,
    private readonly ftsService: FtsService,
    private readonly ftsTransformer: FtsTransformer,
    private readonly userService: UserService,
  ) {
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Post('data')
  @ApiOperation({ title: 'Получение информации о чеке' })
  @ApiResponse({
    status: 201,
    type: BillDto,
  })
  async getBillData(@RequestUser() user: UserEntity, @Body() ftsQrDto: FtsQrDto) {
    const ftsBillData = await this.getBillDataFromFts(user, ftsQrDto);
    return ftsBillData;
  }

  private async getBillDataFromFts(user: UserEntity, ftsQrDto: FtsQrDto): Promise<BillDto> {
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
      if (billDataFromFts) {
        await Promise.all([
          this.billRequestService.makeBillRequestFetched(billRequestId),
          this.billRequestService.addRawDataToBillRequest({ billRequestId, rawData: billDataFromFts }),
        ]);
        return this.ftsTransformer.transformFtsBillToBillDto(billDataFromFts);
      }
    }
    return null;
  }

}
