import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { FtsQrDto } from '../fts/dto/fts-qr.dto';
import { OfdFetcher } from './ofd.ru/fetcher';
import { BillDto } from '../bill/dto/bill.dto';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';
import { DateHelper } from '../helpers/date.helper';
import { FirstOfdFetcher } from './1-ofd.ru/fetcher';
import { OfdFetcherClass } from './base-ofd-fetcher';

@Injectable()
export class OfdService {
  constructor(
    @InjectRepository(BillRequestEntity)
    private readonly billRequestEntityRepository: Repository<BillRequestEntity>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async fetchBillData(qrData: FtsQrDto) {
    const ofdFetcher = new OfdFetcher(qrData);

    const responses: BillDto[] = await Promise.all([
      ofdFetcher.fetchBill(),
    ]);
    const results = responses.filter(response => response !== null);
    if (results.length > 0) {
      return results[ 0 ];
    }
    return null;
  }

  async checkOfd() {
    const billRequestEntities: BillRequestEntity[] = await this.billRequestEntityRepository.query(`
        select *
        from bill_request_entity bre
        where bre."billId" is not null
          and bre."ftsData" is not null
        order by random()
        limit 20
    `);

    const ftsQrDtos: FtsQrDto[] = billRequestEntities.map(billRequest => {
      const qrDto = new FtsQrDto();
      qrDto.checkType = 1;
      qrDto.dateTime = this.dateHelper.transformDateToFtsDate(billRequest.billDate);
      qrDto.fiscalDocument = billRequest.fiscalDocument;
      qrDto.fiscalNumber = billRequest.fiscalNumber;
      qrDto.fiscalProp = billRequest.fiscalProp;
      qrDto.totalSum = billRequest.totalSum;
      return qrDto;
    });
    const ofds: OfdFetcherClass[] = [ OfdFetcher, FirstOfdFetcher ];
    const data = [];
    let i = 0;
    for await (const qrDto of ftsQrDtos) {
      const timeout = (Math.floor(Math.random() * 4 + i) + 3) * 1000;
      await new Promise(r => setTimeout(r, timeout));
      for await (const OfdClass of ofds) {
        const start = Date.now();
        const fetcher = new OfdClass(qrDto, this.dateHelper);
        const response: BillDto = await fetcher.fetchBill();
        const info = {
          name: OfdClass.name,
          qrDto,
          response,
        };
        data.push(info);
        Logger.log(`Iteration: ${i}, Fetcher: ${OfdClass.name}, QrDto: ${JSON.stringify(qrDto)}, Delay: ${timeout}ms, Duration: ${Date.now() - start}ms`);
      }
      i += 1;
    }
    const dir = resolve(__dirname, './../../src', 'data.json');
    console.log('FILE DIR', dir);
    console.log(data);
    writeFileSync(dir, JSON.stringify(data));
    return data;
  }
}
