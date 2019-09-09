import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';

@Module({
  providers: [ PurchaseService ],
})
export class PurchaseModule {
}
