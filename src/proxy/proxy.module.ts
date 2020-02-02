import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyService } from './proxy.service';
import { PuppeteerModule } from '../puppeteer/puppeteer.module';
import { ProxyEntity } from './entity/proxy.entity';
import { ProxyController } from './proxy.controller';

@Module({
  controllers: [ ProxyController ],
  imports: [ TypeOrmModule.forFeature([ ProxyEntity ]), PuppeteerModule ],
  providers: [ ProxyService ],
  exports: [ ProxyService ],
})
export class ProxyModule {
}
