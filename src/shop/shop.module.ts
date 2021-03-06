import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService }   from './shop.service';
import { ShopEntity }    from './entities/shop.entity';
import { BillEntity }    from '../bill/entities/bill.entity';
import { MapsModule }    from '../maps/maps.module';
import { DadataModule }  from '../dadata/dadata.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShopEntity,
      BillEntity,
    ]),
    MapsModule,
    DadataModule,
  ],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {
}
