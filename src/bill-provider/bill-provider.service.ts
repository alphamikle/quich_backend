import { Injectable }         from '@nestjs/common';
import { InjectRepository }   from '@nestjs/typeorm';
import { Repository }         from 'typeorm';
import { BillProviderEntity } from './entities/bill-provider.entity';

export enum ProviderCode {
  FTS = 'fts',
  FIRST_OFD = '1-OFD',
  OFD = 'OFD',
  TAXCOM = 'TAXCOM',
}

@Injectable()
export class BillProviderService {
  constructor(
    @InjectRepository(BillProviderEntity)
    private readonly billProviderRepository: Repository<BillProviderEntity>,
  ) {
  }

  public async getProviderByTitle(title: string): Promise<BillProviderEntity> {
    return this.billProviderRepository.findOne({ where: { title } });
  }

  public async createProvider(title: string): Promise<BillProviderEntity> {
    const provider = new BillProviderEntity();
    provider.title = title;
    return this.billProviderRepository.save(provider);
  }

  async extractBillProvider(title: string): Promise<BillProviderEntity> {
    return (await this.getProviderByTitle(title)) ?? this.createProvider(title);
  }
}
