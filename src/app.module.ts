import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '~/user/user.module';
import { AuthModule } from '~/auth/auth.module';
import { FtsModule } from '~/fts/fts.module';
import { BillModule } from '~/bill/bill.module';
import { ShopModule } from '~/shop/shop.module';
import { PurchaseModule } from '~/purchase/purchase.module';
import { ProductModule } from '~/product/product.module';
import { BillRequestModule } from '~/bill-request/bill-request.module';
import { CategoryModule } from '~/category/category.module';
import { BillProviderModule } from '~/bill-provider/bill-provider.module';
import { OfdModule } from '~/ofd/ofd.module';
import { DadataModule } from '~/dadata/dadata.module';
import { MapsModule } from '~/maps/maps.module';
import { DefaultModule } from '~/default/default.module';
import { EmailModule } from '~/email/email.module';
import { SubscriptionModule } from '~/subscription/subscription.module';
import { ProxyModule } from '~/proxy/proxy.module';
import { PuppeteerModule } from '~/puppeteer/puppeteer.module';
import { typeOrmOptions } from '~/config';
import { MessageModule } from '~/message/message.module';
import { ProvidersModule } from '~/providers/providers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmOptions),
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
    EmailModule,
    SubscriptionModule,
    ProxyModule,
    PuppeteerModule,
    MessageModule,
    ProvidersModule,
  ],
})
export class AppModule {
}
