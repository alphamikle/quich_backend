import { Test, TestingModule }   from '@nestjs/testing';
import { TypeOrmModule }         from '@nestjs/typeorm';
import { forwardRef, Logger }    from '@nestjs/common';
import { UserService }           from './user.service';
import { typeOrmOptions }        from '../config';
import { UserValidator }         from './user.validator';
import { DateHelper }            from '../helpers/date.helper';
import { UserEntity }            from './entities/user.entity';
import { SessionEntity }         from './entities/session.entity';
import { FtsAccountEntity }      from './entities/fts-account.entity';
import { BillEntity }            from '../bill/entities/bill.entity';
import { CategoryToUserEntity }  from '../category/entities/category-to-user.entity';
import { BillRequestEntity }     from '../bill-request/entities/bill-request.entity';
import { FtsAccountQueueEntity } from './entities/fts-account-queue.entity';
import { AuthModule }            from '../auth/auth.module';
import { FtsModule }             from '../fts/fts.module';
import { EmailModule }           from '../email/email.module';
import { SubscriptionModule }    from '../subscription/subscription.module';

jest.setTimeout(600000);

describe('user service test', () => {
  let service: UserService;
  const hasAccountUserId = 'c7d1285c-31f2-4265-939e-c733a19372d4';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmOptions),
        TypeOrmModule.forFeature([
          UserEntity,
          SessionEntity,
          FtsAccountEntity,
          BillEntity,
          CategoryToUserEntity,
          BillRequestEntity,
          FtsAccountQueueEntity,
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
    Logger.log(`${firstAccount.id} - ${secondAccount.id}`);
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
});