import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '~/user/user.controller';
import { UserService } from '~/user/user.service';
import { User } from '~/user/entities/user.entity';
import { UserValidator } from '~/user/user.validator';
import { Session } from '~/user/entities/session.entity';
import { FtsAccount } from '~/user/entities/fts-account.entity';
import { DateHelper } from '~/helpers/date.helper';
import { AuthModule } from '~/auth/auth.module';
import { FtsModule } from '~/fts/fts.module';
import { Bill } from '~/bill/entities/bill.entity';
import { CategoryToUserRel } from '~/category/entities/category-to-user-rel.entity';
import { BillRequest } from '~/bill-request/entities/bill-request.entity';
import { EmailModule } from '~/email/email.module';
import { UserQueryLimit } from '~/user/entities/user-query-limit.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Session,
      FtsAccount,
      Bill,
      CategoryToUserRel,
      BillRequest,
      UserQueryLimit,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => FtsModule),
    EmailModule,
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserValidator,
    DateHelper,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {
}
