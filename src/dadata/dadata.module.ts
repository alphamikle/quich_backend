import { Module } from '@nestjs/common';
import { DadataService } from '~/dadata/dadata.service';

@Module({
  providers: [
    DadataService,
  ],
  exports: [
    DadataService,
  ],
})
export class DadataModule {
}
