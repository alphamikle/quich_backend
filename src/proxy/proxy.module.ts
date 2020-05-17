import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyService } from '~/proxy/proxy.service';
import { PuppeteerModule } from '~/puppeteer/puppeteer.module';
import { ProxyEntity } from '~/proxy/entity/proxy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProxyEntity,
    ]),
    PuppeteerModule,
  ],
  providers: [
    ProxyService,
  ],
  exports: [
    ProxyService,
  ],
})
export class ProxyModule {
}
