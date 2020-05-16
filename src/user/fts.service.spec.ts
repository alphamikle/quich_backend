import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { typeOrmOptions } from '../config';
import { UserValidator } from './user.validator';
import { DateHelper } from '../helpers/date.helper';
import { User } from './entities/user';
import { Session } from './entities/session';
import { FtsAccountEntity } from './entities/fts-account.entity';
import { Bill } from '../bill/entities/bill.entity';
import { CategoryToUserRel } from '../category/entities/category-to-user-rel.entity';
import { BillRequest } from '../bill-request/entities/bill-request.entity';
import { AuthModule } from '../auth/auth.module';
import { FtsModule } from '../fts/fts.module';
import { EmailModule } from '../email/email.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { UserQueryLimitEntity } from './entities/user-query-limit.entity';

jest.setTimeout(600000);

describe('user service test', () => {
  let service: UserService;
  const hasAccountUserId = 'c7d1285c-31f2-4265-939e-c733a19372d4';
  const hasNotAccountUser = '69e76165-f185-4a94-bae4-24250fa1ed7c';
  const accountId = 'aa9caf09-66db-419d-9ea9-a4f866b74b22';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmOptions),
        TypeOrmModule.forFeature([
          User,
          Session,
          FtsAccountEntity,
          Bill,
          CategoryToUserRel,
          BillRequest,
          UserQueryLimitEntity,
        ]),
        forwardRef(() => AuthModule),
        forwardRef(() => FtsModule),
        EmailModule,
        SubscriptionModule,
      ],
      providers: [
        UserService,
        UserValidator,
        DateHelper,
      ],
    })
      .compile();

    service = module.get(UserService);
  });

  it('Get next fts account of user with accounts', async () => {
    const firstAccount = await service.getFtsAccountForUser(hasAccountUserId);
    const secondAccount = await service.getFtsAccountForUser(hasAccountUserId);
    Logger.log(`${ firstAccount.id } - ${ secondAccount.id }`);
    expect(firstAccount.id)
      .not
      .toBe(secondAccount.id);
  });

  it('Get random fts account', async () => {
    const account = await service.getRandomFtsAccount();
    expect(account)
      .not
      .toBe(null);
    expect(account)
      .toHaveProperty('id');
    Logger.log(account.id);
  });

  it('Get account for user without accounts', async () => {
    const account = await service.getFtsAccountForUser(hasNotAccountUser);
    Logger.log(account.phone);
    expect(account)
      .not
      .toBe(undefined);
  });

  it('Increment usings of account for user', async () => {
    await service.incrementUserQueriesLimit({
      userId: hasAccountUserId,
      accountId,
    });
  });
});