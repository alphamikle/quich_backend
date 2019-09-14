import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillRequestEntity } from './entities/bill-request.entity';
import { Repository } from 'typeorm';
import { BillRequestCreatingDto } from './dto/bill-request-creating.dto';
import { FtsQrDto } from '../fts/dto/fts-qr.dto';
import { FtsFetchResponseBill } from '../fts/dto/fts-fetch-response/bill.dto';
import { DateHelper } from '../helpers/date.helper';

@Injectable()
export class BillRequestService {
  constructor(
    @InjectRepository(BillRequestEntity)
    private readonly billRequestEntityRepository: Repository<BillRequestEntity>,
    private readonly dateHelper: DateHelper,
  ) {}

  async getBillRequestByProps({ fiscalDocument, fiscalNumber, fiscalProp }:
                                { fiscalDocument: string, fiscalNumber: string, fiscalProp: string }): Promise<BillRequestEntity> {
    return await this.billRequestEntityRepository.findOne({ where: { fiscalDocument, fiscalNumber, fiscalProp } });
  }

  async createBillRequest({ billDate, fiscalDocument, fiscalNumber, fiscalProp, isFetched, rawData, totalSum, userId }: BillRequestCreatingDto) {
    const billRequestEntity = new BillRequestEntity();
    billRequestEntity.billDate = billDate;
    billRequestEntity.fiscalDocument = fiscalDocument;
    billRequestEntity.fiscalNumber = fiscalNumber;
    billRequestEntity.fiscalProp = fiscalProp;
    billRequestEntity.isFetched = isFetched;
    billRequestEntity.rawData = rawData;
    billRequestEntity.totalSum = totalSum;
    billRequestEntity.userId = userId;
    return await this.billRequestEntityRepository.save(billRequestEntity);
  }

  async findOrCreateBillRequest({ userId, ftsQrDto }: { userId: string, ftsQrDto: FtsQrDto }) {
    let billRequest = await this.getBillRequestByProps({
      fiscalNumber: ftsQrDto.fiscalNumber,
      fiscalDocument: ftsQrDto.fiscalDocument,
      fiscalProp: ftsQrDto.fiscalProp,
    });
    if (!billRequest) {
      billRequest = await this.createBillRequest({
        userId,
        billDate: this.dateHelper.transformFtsDateToDate(ftsQrDto.dateTime),
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

  async makeBillRequestFetched(billRequestId: string): Promise<void> {
    await this.billRequestEntityRepository.update({ id: billRequestId }, { isFetched: true });
  }

  async addRawDataToBillRequest({ billRequestId, rawData }: { billRequestId: string, rawData: FtsFetchResponseBill }): Promise<void> {
    await this.billRequestEntityRepository.update({ id: billRequestId }, { rawData });
  }
}
