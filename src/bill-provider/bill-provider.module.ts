import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillProviderService } from '~/bill-provider/bill-provider.service';
import { BillProvider } from '~/bill-provider/entities/bill-provider.entity';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BillProvider,
      BillRequest,
    ]),
  ],
  providers: [
    BillProviderService,
  ],
  exports: [
    BillProviderService,
  ],
})
export class BillProviderModule {
}
