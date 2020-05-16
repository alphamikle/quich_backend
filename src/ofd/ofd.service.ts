import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { FtsQrDto } from '../fts/dto/fts-qr.dto';
import { OfdFetcher } from './ofd.ru/fetcher';
import { BillDto } from '../bill/dto/bill.dto';
import { BillRequest } from '../bill-request/entities/bill-request.entity';
import { DateHelper } from '../helpers/date.helper';
import { OfdFetcherClass } from './base-ofd-fetcher';
import { ProxyService } from '../proxy/proxy.service';
import { FirstOfdPuppeteerFetcher } from './1-ofd.ru/puppeteer-fetcher';
import { TaxcomFetcher } from './taxcom.ru/fetcher';

@Injectable()
export class OfdService {
  constructor(
    @InjectRepository(BillRequest)
    private readonly billRequestEntityRepository: Repository<BillRequest>,
    private readonly dateHelper: DateHelper,
    private readonly proxyService: ProxyService,
    // private readonly puppeteerService: PuppeteerService,
  ) {
  }

  async fetchBillData(qrData: FtsQrDto): Promise<BillDto | null> {
    const ofdFetcher = new OfdFetcher(qrData, {
      proxyService: this.proxyService,
      dateHelper: this.dateHelper,
    });
    // const firstOfdFetcher = new FirstOfdPuppeteerFetcher(qrData, this.puppeteerService, this.dateHelper);
    const taxcomOfdFetcher = new TaxcomFetcher(qrData, {
      proxyService: this.proxyService,
      dateHelper: this.dateHelper,
    });

    const promisesArr: Promise<BillDto>[] = [
      ofdFetcher.fetchBill(),
      // firstOfdFetcher.fetchBill(),
      taxcomOfdFetcher.fetchBill(),
    ];

    const firstResponse = await Promise.race(promisesArr);
    if (firstResponse !== null) {
      return firstResponse;
    }

    const responses: BillDto[] = await Promise.all(promisesArr);
    const results = responses.filter(response => response !== null);
    if (results.length > 0) {
      return results[0];
    }
    return null;
  }

  async checkOfd() {
    const billRequestEntities: BillRequest[] = await this.billRequestEntityRepository.query(`
        select *
        from bill_request_entity bre
            /*where bre."billId" is not null
              and bre."ftsData" is not null*/
        order by random()
        limit 100
    `);
    Logger.log(`Found ${ billRequestEntities.length } billRequestEntities`);
    const ftsQrDtos: FtsQrDto[] = billRequestEntities.map(billRequest => {
      const qrDto = new FtsQrDto();
      qrDto.checkType = 1;
      qrDto.ftsDateTime = this.dateHelper.transformDateToFtsDate(billRequest.billDate);
      qrDto.fiscalDocument = billRequest.fiscalDocument;
      qrDto.fiscalNumber = billRequest.fiscalNumber;
      qrDto.fiscalProp = billRequest.fiscalProp;
      qrDto.totalSum = billRequest.totalSum;
      return qrDto;
    });
    const ofds: OfdFetcherClass[] = [
      OfdFetcher,
      FirstOfdPuppeteerFetcher,
    ];
    const data: any[] = [];
    let i = 0;
    await Promise.all(ftsQrDtos.map(async qrDto => {
      await Promise.all(ofds.map(async OfdClass => {
        const start = Date.now();
        const fetcher = new OfdClass(qrDto, {
          dateHelper: this.dateHelper,
          proxyService: this.proxyService,
        });
        const response: BillDto = await fetcher.fetchBill();
        const info = {
          name: OfdClass.name,
          qrDto,
          response,
        };
        data.push(info);
        Logger.debug(`Iteration: ${ i }, Fetcher: ${ OfdClass.name }, QrDto: ${ JSON.stringify(qrDto) }, Duration: ${ Date.now() - start }ms`);
      }));
      i += 1;
    }));
    const dir = resolve(__dirname, '../', 'data.json');
    Logger.log('FILE DIR', dir);
    writeFileSync(dir, JSON.stringify(data));
    return data.filter(item => item.response !== null);
  }
}
