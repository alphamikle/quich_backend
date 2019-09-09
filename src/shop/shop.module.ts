import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';

@Module({
  providers: [ ShopService ],
})
export class ShopModule {
}
