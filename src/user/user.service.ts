import { BadRequestException, Injectable }              from '@nestjs/common';
import { InjectRepository }                             from '@nestjs/typeorm';
import { Between, FindConditions, In, Not, Repository } from 'typeorm';
import { UserEntity }                                   from './entities/user.entity';
import { SessionEntity }                                from './entities/session.entity';
import { DateHelper }                                   from '../helpers/date.helper';
import { FtsAccountEntity }                             from './entities/fts-account.entity';
import { FtsAccountDto }                                from '../fts/dto/fts-account.dto';
import { FTS_ACCOUNTS_ALL_BUSY_ERROR }                  from '../helpers/text';
import { UserQueryLimitEntity }                         from './entities/user-query-limit.entity';

const { TOKEN_DURATION } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionEntityRepository: Repository<SessionEntity>,
    @InjectRepository(FtsAccountEntity)
    private readonly ftsAccountEntityRepository: Repository<FtsAccountEntity>,
    @InjectRepository(UserQueryLimitEntity)
    private readonly userQueryLimitEntityRepository: Repository<UserQueryLimitEntity>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async setUserPassword({ user, password }: { user: UserEntity, password: string }): Promise<UserEntity> {
    user.password = password;
    return this.userEntityRepository.save(user);
  }

  async createUser({ email, passwordHash }: { email: string, passwordHash: string }): Promise<UserEntity> {
    const user = new UserEntity();
    user.email = email;
    user.password = passwordHash;
    return this.userEntityRepository.save(user);
  }

  async createSession({ token, user }: { token: string, user: UserEntity }): Promise<SessionEntity> {
    const session = new SessionEntity();
    session.token = token;
    session.user = user;
    session.expiredAt = this.dateHelper.addDays(new Date(), Number(TOKEN_DURATION));
    return this.sessionEntityRepository.save(session);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.userEntityRepository.findOne({ where: { email } });
  }

  async getUserByToken(token: string): Promise<UserEntity> {
    const session = await this.sessionEntityRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!session) {
      return undefined;
    }
    return session.user;
  }

  async makeSessionInvalid(token: string): Promise<void> {
    const session = await this.sessionEntityRepository.findOne({ where: { token } });
    if (session) {
      session.isExpired = true;
      await this.sessionEntityRepository.save(session);
    }
  }

  async getFtsAccountsByUserId(userId: string): Promise<FtsAccountEntity[]> {
    return this.ftsAccountEntityRepository.find({ where: { userId } });
  }

  async addFtsAccountToUser({ user, ftsAccountData }: { user: UserEntity, ftsAccountData: FtsAccountDto }): Promise<FtsAccountEntity> {
    const ftsAccount = new FtsAccountEntity();
    ftsAccount.phone = ftsAccountData.phone;
    ftsAccount.password = ftsAccountData.password;
    ftsAccount.userId = user.id;
    return this.ftsAccountEntityRepository.save(ftsAccount);
  }

  async deleteFtsAccountFromUser({ userId, phone }: { userId: string, phone: string }): Promise<void> {
    await this.ftsAccountEntityRepository.delete({
      userId,
      phone,
    });
  }

  async hasUserFtsAccount(userId: string): Promise<boolean> {
    const count = await this.ftsAccountEntityRepository.count({ where: { userId } });
    return count > 0;
  }

  async getRandomFtsAccount(): Promise<FtsAccountEntity | null> {
    const lessUsedFtsAccountsIds: Array<{ id: string }> = await this.ftsAccountEntityRepository.query(`
        SELECT fe.id
        FROM fts_account_entity fe
                 FULL JOIN fts_account_usings_entity us ON us.phone = fe.phone
        WHERE (not exists(select id from fts_account_usings_entity us2 where us2.phone = us.phone) or us.uses < 15)
        ORDER BY fe."lastUsingDate"
    `);
    if (lessUsedFtsAccountsIds.length === 0) {
      return null;
    }
    const account = await this.ftsAccountEntityRepository.findOne(lessUsedFtsAccountsIds[0].id);
    await this.ftsAccountEntityRepository.save(account);
    return account;
  }

  // ? Выбирает из списка аккаунтов ФНС пользователя тот, что использовался раньше всех
  async getNextFtsAccountByUserId(userId: string): Promise<FtsAccountEntity> {
    const exceededIds = await this.getUserAccountsWithExceededLimit(userId);
    const where: FindConditions<FtsAccountEntity> = {
      userId,
    };
    if (exceededIds?.length > 0) {
      where.id = Not(In(exceededIds));
    }
    const account = await this.ftsAccountEntityRepository.findOne({
      where,
      order: { lastUsingDate: 'ASC' },
    });
    await this.ftsAccountEntityRepository.save(account);
    return account;
  }

  private async getUserAccountsWithExceededLimit(userId: string): Promise<string[]> {
    const userAccounts: Array<{ id: string }> = await this.ftsAccountEntityRepository.query(`
        SELECT fe.id
        FROM fts_account_entity fe
                 FULL JOIN fts_account_usings_entity us on fe.phone = us.phone
                 where fe."userId" = '${userId}' and us.uses is not null and us.uses > 14
    `);
    return userAccounts.map(account => account.id);
  }

  async getFtsAccountForUser(userId: string): Promise<FtsAccountEntity> {
    const hasUserFtsAccount = await this.hasUserFtsAccount(userId);
    let ftsAccount: FtsAccountEntity;
    if (hasUserFtsAccount) {
      ftsAccount = await this.getNextFtsAccountByUserId(userId);
    }
    if (!ftsAccount) {
      ftsAccount = await this.getRandomFtsAccount();
    }
    if (!ftsAccount) {
      throw new BadRequestException({ push: FTS_ACCOUNTS_ALL_BUSY_ERROR });
    }
    return ftsAccount;
  }

  async incrementUserQueriesLimit({ userId, accountId }: { userId: string; accountId: string }): Promise<void> {
    let query = await this.getUserQueryUses(userId);
    if (query === undefined) {
      query = new UserQueryLimitEntity();
      query.usingDay = new Date();
      query.queries = 0;
      query.userId = userId;
      query.usingHistory = [];
    }
    query.queries += 1;
    query.usingHistory.push({
      accountId,
      dateTime: new Date(),
    });
  }

  async getUserQueryUses(userId: string): Promise<UserQueryLimitEntity | undefined> {
    const currentDate = new Date();
    const nextDate = this.dateHelper.addDays(currentDate, 1);
    return this.userQueryLimitEntityRepository.findOne({
      where: {
        userId,
        usingDay: Between(currentDate, nextDate),
      },
    });
  }
}
