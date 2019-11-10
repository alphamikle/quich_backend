import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { FtsModule } from './fts/fts.module';
import { BillModule } from './bill/bill.module';
import { ShopModule } from './shop/shop.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ProductModule } from './product/product.module';
import { BillRequestModule } from './bill-request/bill-request.module';
import { CategoryModule } from './category/category.module';
import { BillProviderModule } from './bill-provider/bill-provider.module';
import { OfdModule } from './ofd/ofd.module';
import { DadataModule } from './dadata/dadata.module';
import { MapsModule } from './maps/maps.module';
import { DefaultModule } from './default/default.module';

const { DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SYNC, DB_OLD_HOST, DB_OLD_USERNAME, DB_OLD_PASSWORD, DB_OLD_NAME } = process.env;

console.log('SYSTEM VARIABLES:', DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SYNC, DB_OLD_HOST, DB_OLD_USERNAME, DB_OLD_PASSWORD, DB_OLD_NAME);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
      synchronize: DB_SYNC === 'true',
      // logging: 'all',
    }),
    TypeOrmModule.forRoot({
      name: 'oldDb',
      type: 'postgres',
      host: DB_OLD_HOST,
      port: 5432,
      username: DB_OLD_USERNAME,
      password: DB_OLD_PASSWORD,
      database: DB_OLD_NAME,
      entities: [ __dirname + '/default/models/*.model{.ts,.js}' ],
      synchronize: false,
    }),
    PassportModule,
    UserModule,
    AuthModule,
    FtsModule,
    BillModule,
    ShopModule,
    PurchaseModule,
    ProductModule,
    BillRequestModule,
    CategoryModule,
    BillProviderModule,
    OfdModule,
    DadataModule,
    MapsModule,
    DefaultModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
