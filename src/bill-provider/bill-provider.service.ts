import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillProviderEntity } from './entities/bill-provider.entity';

export enum ProviderCode {
  FTS,
  FIRST_OFD,
  OFD,
  TAXCOM,
}

@Injectable()
export class BillProviderService {
  constructor(
    @InjectRepository(BillProviderEntity)
    private readonly billProviderRepository: Repository<BillProviderEntity>,
  ) {
  }

  public async getProviderByTitle(title: ProviderCode): Promise<BillProviderEntity> {
    return this.billProviderRepository.findOne({ where: { title } });
  }

  public async createProvider(code: ProviderCode): Promise<BillProviderEntity> {
    const provider = new BillProviderEntity();
    provider.title = code;
    return this.billProviderRepository.save(provider);
  }

  async extractBillProvider(code: ProviderCode): Promise<BillProviderEntity> {
    return (await this.getProviderByTitle(code)) ?? this.createProvider(code);
  }
}
