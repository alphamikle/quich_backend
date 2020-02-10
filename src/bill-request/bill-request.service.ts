import { Injectable }             from '@nestjs/common';
import { InjectRepository }       from '@nestjs/typeorm';
import { IsNull, Repository }     from 'typeorm';
import { BillRequestEntity }      from './entities/bill-request.entity';
import { BillRequestCreatingDto } from './dto/bill-request-creating.dto';
import { FtsQrDto }               from '../fts/dto/fts-qr.dto';
import { FtsFetchResponseBill }   from '../fts/dto/fts-fetch-response/bill.dto';
import { DateHelper }             from '../helpers/date.helper';
import { BillDto }                from '../bill/dto/bill.dto';

@Injectable()
export class BillRequestService {
  constructor(
    @InjectRepository(BillRequestEntity)
    private readonly billRequestEntityRepository: Repository<BillRequestEntity>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async getBillRequestByProps({ fiscalDocument, fiscalNumber, fiscalProp }: { fiscalDocument: string, fiscalNumber: string, fiscalProp: string }): Promise<BillRequestEntity> {
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

  async getBillRequestById(id: string): Promise<BillRequestEntity> {
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

  async createBillRequest({ billDate, fiscalDocument, fiscalNumber, fiscalProp, isFetched, totalSum, userId }: BillRequestCreatingDto):
    Promise<BillRequestEntity> {
    const billRequestEntity = new BillRequestEntity();
    billRequestEntity.billDate = billDate;
    billRequestEntity.fiscalDocument = fiscalDocument;
    billRequestEntity.fiscalNumber = fiscalNumber;
    billRequestEntity.fiscalProp = fiscalProp;
    billRequestEntity.isFetched = isFetched;
    billRequestEntity.totalSum = totalSum;
    billRequestEntity.userId = userId;
    return this.billRequestEntityRepository.save(billRequestEntity);
  }

  async findOrCreateBillRequest({ userId, ftsQrDto }: { userId: string, ftsQrDto: FtsQrDto }): Promise<BillRequestEntity> {
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

  async addFtsDataToBillRequest({ billRequestId, ftsData }: { billRequestId: string, ftsData: FtsFetchResponseBill }): Promise<void> {
    await this.billRequestEntityRepository.update({ id: billRequestId }, { ftsData });
  }

  async getUnloadedBillRequestsByUserId(userId: string): Promise<BillRequestEntity[]> {
    return this.billRequestEntityRepository.find({
      where: {
        billId: IsNull(),
        userId,
      },
      order: { billDate: 'DESC' },
    });
  }
}
