import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillRequestService } from './bill-request.service';
import { BillRequestEntity } from './entities/bill-request.entity';
import { Bill } from '../bill/entities/bill';
import { User } from '../user/entities/user';
import { BillProviderEntity } from '../bill-provider/entities/bill-provider.entity';
import { DateHelper } from '../helpers/date.helper';
import { BillRequestValidator } from './bill-request.validator';
import { BillRequestController } from './bill-request.controller';

@Module({
  controllers: [BillRequestController],
  imports: [
    TypeOrmModule.forFeature([
      BillRequestEntity,
      Bill,
      User,
      BillProviderEntity,
    ]),
  ],
  providers: [
    BillRequestService,
    DateHelper,
    BillRequestValidator,
  ],
  exports: [BillRequestService],
})
export class BillRequestModule {
}
