import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserValidator } from './user.validator';
import { SessionEntity } from './entities/session.entity';
import { FtsAccountEntity } from './entities/fts-account.entity';
import { DateHelper } from '../helpers/date.helper';
import { AuthModule } from '../auth/auth.module';
import { FtsModule } from '../fts/fts.module';
import { BillEntity } from '../bill/entities/bill.entity';
import { CategoryToUserEntity } from '../category/entities/category-to-user.entity';
import { BillRequestEntity } from '../bill-request/entities/bill-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ UserEntity, SessionEntity, FtsAccountEntity, BillEntity, CategoryToUserEntity, BillRequestEntity ]),
    forwardRef(() => AuthModule), FtsModule,
  ],
  controllers: [ UserController ],
  providers: [ UserService, UserValidator, DateHelper ],
  exports: [ UserService ],
})
export class UserModule {
}
