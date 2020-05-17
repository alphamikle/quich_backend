import { Module } from '@nestjs/common';
import { PuppeteerService } from '~/puppeteer/puppeteer.service';

@Module({
  providers: [
    PuppeteerService,
  ],
  exports: [
    PuppeteerService,
  ],
})
export class PuppeteerModule {
}
