import { Module } from '@nestjs/common';
import { FtsService } from './fts.service';
import { FtsValidator } from './fts.validator';

@Module({
  providers: [ FtsService, FtsValidator ],
  exports: [ FtsValidator ],
})
export class FtsModule {
}
