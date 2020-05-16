import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './shop.service';
import { ShopEntity } from './entities/shop.entity';
import { Bill } from '../bill/entities/bill';
import { MapsModule } from '../maps/maps.module';
import { DadataModule } from '../dadata/dadata.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShopEntity,
      Bill,
    ]),
    MapsModule,
    DadataModule,
  ],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {
}
