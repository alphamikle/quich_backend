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

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SYNC } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: 5432,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [ __dirname + '/**/*.entity{.ts,.js}' ],
      synchronize: DB_SYNC === 'true',
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
