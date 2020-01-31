import { Injectable } from '@nestjs/common';
import { BillRequestService } from './bill-request.service';
import { INCORRECT_USER_ID, NOT_FOUND_BILL_REQUEST } from '../helpers/text';

@Injectable()
export class BillRequestValidator {
  constructor(
    private readonly billRequestService: BillRequestService,
  ) {
  }

  async isBillRequestExistToUser({ userId, billRequestId }: { userId: string, billRequestId: string }): Promise<string | false> {
    const billRequest = await this.billRequestService.getBillRequestById(billRequestId);
    if (!billRequest) {
      return NOT_FOUND_BILL_REQUEST;
    }
    if (billRequest.userId !== userId) {
      return INCORRECT_USER_ID;
    }
    return false;
  }
}
