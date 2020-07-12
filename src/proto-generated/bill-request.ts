import { Metadata } from 'grpc';
/* eslint-disable */
import { BillDto } from './bill';
import { Empty } from './google/protobuf/empty';


export interface BillRequestIdDto {
  billRequestId: string;
}

export interface BillRequest {
  id: string;
  fiscalProp: string;
  fiscalNumber: string;
  fiscalDocument: string;
  billDate?: Date;
  totalSum: number;
  rawDat?: BillDto;
  isFetched: boolean;
}

export interface BillRequestController {

  deleteBillRequest(request: BillRequestIdDto, meta: Metadata): Promise<Empty>;

}
