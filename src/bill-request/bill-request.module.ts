import { Module } from '@nestjs/common';
import { BillRequestService } from './bill-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillRequestEntity } from './entities/bill-request.entity';
import { BillEntity } from '../bill/entities/bill.entity';
import { UserEntity } from '../user/entities/user.entity';
import { BillProviderEntity } from '../bill-provider/entities/bill-provider.entity';
import { DateHelper } from '../helpers/date.helper';

@Module({
  imports: [ TypeOrmModule.forFeature([ BillRequestEntity, BillEntity, UserEntity, BillProviderEntity ]) ],
  providers: [ BillRequestService, DateHelper ],
  exports: [ BillRequestService ],
})
export class BillRequestModule {
}
