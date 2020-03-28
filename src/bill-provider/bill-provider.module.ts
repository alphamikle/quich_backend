import { Module }              from '@nestjs/common';
import { TypeOrmModule }       from '@nestjs/typeorm';
import { BillProviderService } from './bill-provider.service';
import { BillProviderEntity }  from './entities/bill-provider.entity';
import { BillRequestEntity }   from '../bill-request/entities/bill-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BillProviderEntity,
      BillRequestEntity,
    ]),
  ],
  providers: [BillProviderService],
  exports: [BillProviderService],
})
export class BillProviderModule {
}
