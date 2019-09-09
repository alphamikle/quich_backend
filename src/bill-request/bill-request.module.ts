import { Module } from '@nestjs/common';
import { BillRequestService } from './bill-request.service';

@Module({
  providers: [ BillRequestService ],
})
export class BillRequestModule {
}
