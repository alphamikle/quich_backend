import { BadRequestException, Controller } from '@nestjs/common';
import { Metadata } from 'grpc';
import { BillRequestService } from '~/bill-request/bill-request.service';
import { BillRequestValidator } from '~/bill-request/bill-request.validator';
import { securedGrpc } from '~/providers/decorators';
import { BillRequestIdDto } from '~/bill-request/dto/bill-request-id.dto';
import * as billRequest from '~/proto-generated/bill-request';
import { Empty } from '~/providers/empty';

@Controller()
export class BillRequestController implements billRequest.BillRequestController {
  constructor(
    private readonly billRequestService: BillRequestService,
    private readonly billRequestValidator: BillRequestValidator,
  ) {
  }

  @securedGrpc
  async deleteBillRequest({ billRequestId }: BillRequestIdDto, { user }: Metadata): Promise<Empty> {
    const validationResult = await this.billRequestValidator.isBillRequestExistToUser({
      userId: user.id,
      billRequestId,
    });
    if (validationResult) {
      throw new BadRequestException({ push: validationResult });
    }
    await this.billRequestService.deleteBillRequestById(billRequestId);
    return new Empty();
  }
}
