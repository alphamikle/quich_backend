import { BadRequestException, Param } from '@nestjs/common';
import { BillRequestService } from './bill-request.service';
import { RequestUser } from '../user/user.decorator';
import { User } from '../user/entities/user';
import { BillRequestValidator } from './bill-request.validator';
import { OK } from '../helpers/text';
import { SecureDeleteAction, TagController } from '../helpers/decorators';

@TagController('bill-request')
export class BillRequestController {
  constructor(
    private readonly billRequestService: BillRequestService,
    private readonly billRequestValidator: BillRequestValidator,
  ) {
  }

  @SecureDeleteAction('Удаление запроса на получение чека из ФНС', String, ':billRequestId')
  async deleteBillRequest(@RequestUser() user: User, @Param('billRequestId') billRequestId: string) {
    const validationResult = await this.billRequestValidator.isBillRequestExistToUser({
      userId: user.id,
      billRequestId,
    });
    if (validationResult) {
      throw new BadRequestException({ push: validationResult });
    }
    await this.billRequestService.deleteBillRequestById(billRequestId);
    return OK;
  }
}
