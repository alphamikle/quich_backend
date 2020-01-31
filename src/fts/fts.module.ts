import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FtsService } from './fts.service';
import { FtsValidator } from './fts.validator';
import { CommonValidator } from '../helpers/common.validator';
import { FtsController } from './fts.controller';
import { FtsAccountEntity } from '../user/entities/fts-account.entity';
import { UserModule } from '../user/user.module';
import { FtsAccountToBillRequestEntity } from './entities/fts-account-to-bill-request.entity';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';
import { BillRequestModule } from '../bill-request/bill-request.module';
import { DateHelper } from '../helpers/date.helper';
import { FtsTransformer } from './fts.transformer';

@Module({
  imports: [
    TypeOrmModule.forFeature([ FtsAccountEntity, FtsAccountToBillRequestEntity, BillRequestEntity ]),
    forwardRef(() => UserModule),
    BillRequestModule,
  ],
  controllers: [ FtsController ],
  providers: [ FtsService, FtsValidator, FtsTransformer, CommonValidator, DateHelper ],
  exports: [ FtsValidator, FtsService, FtsTransformer ],
})
export class FtsModule {
}
