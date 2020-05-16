import * as billRequest from '~/proto-generated/bill-request';

export class BillRequestIdDto implements billRequest.BillRequestIdDto {
  billRequestId!: string;
}