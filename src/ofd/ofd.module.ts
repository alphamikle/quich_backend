import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfdService } from './ofd.service';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { DateHelper } from '~/helpers/date.helper';
import { ProxyModule } from '~/proxy/proxy.module';
import { PuppeteerModule } from '~/puppeteer/puppeteer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BillRequest,
    ]),
    ProxyModule,
    PuppeteerModule,
  ],
  providers: [
    OfdService,
    DateHelper,
  ],
  exports: [
    OfdService,
  ],
})
export class OfdModule {
}
