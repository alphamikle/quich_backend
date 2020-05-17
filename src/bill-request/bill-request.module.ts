import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillRequestService } from '~/bill-request/bill-request.service';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { Bill } from '~/bill/entities/bill.entity';
import { User } from '~/user/entities/user.entity';
import { BillProvider } from '~/bill-provider/entities/bill-provider.entity';
import { BillRequestValidator } from '~/bill-request/bill-request.validator';
import { BillRequestController } from '~/bill-request/bill-request.controller';

@Module({
  controllers: [
    BillRequestController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      BillRequest,
      Bill,
      User,
      BillProvider,
    ]),
  ],
  providers: [
    BillRequestService,
    BillRequestValidator,
  ],
  exports: [
    BillRequestService,
  ],
})
export class BillRequestModule {
}
