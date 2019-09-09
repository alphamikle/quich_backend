import { Module } from '@nestjs/common';
import { FtsService } from './fts.service';
import { FtsValidator } from './fts.validator';
import { CommonValidator } from '../helpers/common.validator';
import { FtsController } from './fts.controller';

@Module({
  controllers: [ FtsController ],
  providers: [ FtsService, FtsValidator, CommonValidator ],
  exports: [ FtsValidator ],
})
export class FtsModule {
}
