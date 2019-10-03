import { Injectable } from '@nestjs/common';
import { FtsQrDto } from '../fts/dto/fts-qr.dto';
import { OfdFetcher } from './ofd.ru/fetcher';
import { BillDto } from '../bill/dto/bill.dto';

@Injectable()
export class OfdService {
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
}
