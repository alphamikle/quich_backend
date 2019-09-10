import { Module } from '@nestjs/common';
import { BillProviderService } from './bill-provider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillProviderEntity } from './entities/bill-provider.entity';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ BillProviderEntity, BillRequestEntity ]) ],
  providers: [ BillProviderService ],
})
export class BillProviderModule {
}
