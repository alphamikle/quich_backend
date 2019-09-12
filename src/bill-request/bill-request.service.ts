import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillRequestEntity } from './entities/bill-request.entity';
import { Repository } from 'typeorm';
import { BillRequestCreatingDto } from './dto/bill-request-creating.dto';

@Injectable()
export class BillRequestService {
  constructor(
    @InjectRepository(BillRequestEntity)
    private readonly billRequestEntityRepository: Repository<BillRequestEntity>,
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
}
