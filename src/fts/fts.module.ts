import { Module } from '@nestjs/common';
import { FtsService } from './fts.service';
import { FtsValidator } from './fts.validator';
import { CommonValidator } from '../helpers/common.validator';
import { FtsController } from './fts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FtsAccountEntity } from '../user/entities/fts-account.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ FtsAccountEntity ]) ],
  controllers: [ FtsController ],
  providers: [ FtsService, FtsValidator, CommonValidator ],
  exports: [ FtsValidator, FtsService ],
})
export class FtsModule {
}
