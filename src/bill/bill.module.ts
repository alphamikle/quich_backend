import { Module } from '@nestjs/common';
import { BillService } from './bill.service';

@Module({
  providers: [ BillService ],
})
export class BillModule {
}
