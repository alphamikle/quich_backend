import { Module } from '@nestjs/common';
import { BillRequestService } from './bill-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillRequestEntity } from './entities/bill-request.entity';
import { BillEntity } from '../bill/entities/bill.entity';
import { UserEntity } from '../user/entities/user.entity';
import { BillProviderEntity } from '../bill-provider/entities/bill-provider.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ BillRequestEntity, BillEntity, UserEntity, BillProviderEntity ]) ],
  providers: [ BillRequestService ],
})
export class BillRequestModule {
}
