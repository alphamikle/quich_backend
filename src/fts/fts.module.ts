import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FtsService } from '~/fts/fts.service';
import { FtsValidator } from '~/fts/fts.validator';
import { CommonValidator } from '~/helpers/common.validator';
import { FtsAccount } from '~/user/entities/fts-account.entity';
import { UserModule } from '~/user/user.module';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { BillRequestModule } from '~/bill-request/bill-request.module';
import { FtsTransformer } from '~/fts/fts.transformer';
import { DateHelper } from '~/helpers/date.helper';
import { FtsAccountUsings } from '~/fts/entities/fts-account-usings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FtsAccount,
      BillRequest,
      FtsAccountUsings,
    ]),
    forwardRef(() => UserModule),
    BillRequestModule,
  ],
  providers: [
    FtsService,
    FtsValidator,
    FtsTransformer,
    CommonValidator,
    DateHelper,
  ],
  exports: [
    FtsValidator,
    FtsService,
    FtsTransformer,
  ],
})
export class FtsModule {
}
