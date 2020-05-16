import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { BillRequestCreatingDto } from '~/bill-request/dto/bill-request-creating.dto';
import { FtsQrDto } from '~/fts/dto/fts-qr.dto';
import { FtsFetchResponseBill } from '~/fts/dto/fts-fetch-response/bill.dto';
import { DateHelper } from '~/helpers/date.helper';
import { BillDto } from '~/bill/dto/bill.dto';

@Injectable()
export class BillRequestService {
  constructor(
    @InjectRepository(BillRequest)
    private readonly billRequestEntityRepository: Repository<BillRequest>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async getBillRequests({ limit, offset }: { limit: number; offset: number }) {
    return this.billRequestEntityRepository.find({
      where: {
        isFetched: true,
        billId: Not(IsNull()),
      },
      take: limit,
      skip: offset,
    });
  }

  async getBillRequestByProps({ fiscalDocument, fiscalNumber, fiscalProp }: { fiscalDocument: string, fiscalNumber: string, fiscalProp: string }): Promise<BillRequest> {
    return this.billRequestEntityRepository.findOne({
      where: {
        fiscalDocument,
        fiscalNumber,
        fiscalProp,
      },
    });
  }

  async deleteBillRequestById(id: string) {
    await this.billRequestEntityRepository.delete({ id });
  }

  async getBillRequestById(id: string): Promise<BillRequest> {
    return this.billRequestEntityRepository.findOne(id);
  }

  async incrementIterations(id: string): Promise<void> {
    await this.billRequestEntityRepository.update({ id }, { fetchingIterations: () => '"fetchingIterations" + 1' });
  }

  async setRawData({ id, rawData }: { id: string, rawData: BillDto }): Promise<void> {
    rawData.billRequestId = id;
    await this.billRequestEntityRepository.update({ id }, {
      isFetched: true,
      rawData,
    });
  }

  async setBillIdToBillRequest({ billRequestId, billId }: { billRequestId: string, billId: string }): Promise<void> {
    await this.billRequestEntityRepository.update({ id: billRequestId }, { billId });
  }

  async createBillRequest({ billDate, fiscalDocument, fiscalNumber, fiscalProp, isFetched, totalSum, userId }: BillRequestCreatingDto): Promise<BillRequest> {
    const billRequestEntity = new BillRequest();
    billRequestEntity.billDate = billDate;
    billRequestEntity.fiscalDocument = fiscalDocument;
    billRequestEntity.fiscalNumber = fiscalNumber;
    billRequestEntity.fiscalProp = fiscalProp;
    billRequestEntity.isFetched = isFetched;
    billRequestEntity.totalSum = totalSum;
    billRequestEntity.userId = userId;
    return this.billRequestEntityRepository.save(billRequestEntity);
  }

  async findOrCreateBillRequest({ userId, ftsQrDto }: { userId: string, ftsQrDto: FtsQrDto }): Promise<BillRequest> {
    let billRequest = await this.getBillRequestByProps({
      fiscalNumber: ftsQrDto.fiscalNumber,
      fiscalDocument: ftsQrDto.fiscalDocument,
      fiscalProp: ftsQrDto.fiscalProp,
    });
    if (!billRequest) {
      billRequest = await this.createBillRequest({
        userId,
        billDate: this.dateHelper.transformFtsDateToDate(ftsQrDto.ftsDateTime),
        totalSum: ftsQrDto.totalSum,
        fiscalProp: ftsQrDto.fiscalProp,
        fiscalNumber: ftsQrDto.fiscalNumber,
        fiscalDocument: ftsQrDto.fiscalDocument,
      });
    }
    return billRequest;
  }

  async makeBillRequestChecked(billRequestId: string): Promise<void> {
    await this.billRequestEntityRepository.update({ id: billRequestId }, { isChecked: true });
  }

  async makeBillRequestFetched(billRequestId: string, billProviderId: string): Promise<void> {
    await this.billRequestEntityRepository.update({ id: billRequestId }, {
      isFetched: true,
      billProviderId,
    });
  }

  async addFtsDataToBillRequest({ billRequestId, ftsData }: { billRequestId: string, ftsData: FtsFetchResponseBill }): Promise<void> {
    await this.billRequestEntityRepository.update({ id: billRequestId }, { ftsData });
  }

  async getUnloadedBillRequestsByUserId(userId: string): Promise<BillRequest[]> {
    return this.billRequestEntityRepository.find({
      where: {
        billId: IsNull(),
        userId,
      },
      order: { billDate: 'DESC' },
    });
  }
}
