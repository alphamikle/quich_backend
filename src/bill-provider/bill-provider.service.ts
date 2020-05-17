import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillProvider, ProviderCode } from '~/bill-provider/entities/bill-provider.entity';

@Injectable()
export class BillProviderService {
  constructor(
    @InjectRepository(BillProvider)
    private readonly billProviderRepository: Repository<BillProvider>,
  ) {
  }

  public async getProviderByTitle(title: ProviderCode): Promise<BillProvider> {
    return this.billProviderRepository.findOne({ where: { title } });
  }

  public async createProvider(code: ProviderCode): Promise<BillProvider> {
    const provider = new BillProvider();
    provider.title = code;
    return this.billProviderRepository.save(provider);
  }

  async extractBillProvider(code: ProviderCode): Promise<BillProvider> {
    return (await this.getProviderByTitle(code)) ?? this.createProvider(code);
  }
}
