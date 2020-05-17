import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindConditions, In, Not, Repository } from 'typeorm';
import { User } from '~/user/entities/user.entity';
import { Session } from '~/user/entities/session.entity';
import { DateHelper } from '~/helpers/date.helper';
import { FtsAccount } from '~/user/entities/fts-account.entity';
import { FtsAccountDto } from '~/fts/dto/fts-account.dto';
import { FTS_ACCOUNTS_ALL_BUSY_ERROR } from '~/helpers/text';
import { UserQueryLimit } from '~/user/entities/user-query-limit.entity';
import { FtsQrDto } from '~/fts/dto/fts-qr.dto';
import { getHash } from '~/helpers/common.helper';

const { TOKEN_DURATION } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionEntityRepository: Repository<Session>,
    @InjectRepository(FtsAccount)
    private readonly ftsAccountEntityRepository: Repository<FtsAccount>,
    @InjectRepository(UserQueryLimit)
    private readonly userQueryLimitEntityRepository: Repository<UserQueryLimit>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async setUserPassword({ user, password }: { user: User, password: string }): Promise<User> {
    user.password = password;
    return this.userEntityRepository.save(user);
  }

  async createUser({ email, passwordHash }: { email: string, passwordHash: string }): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = passwordHash;
    return this.userEntityRepository.save(user);
  }

  async createSession({ token, user }: { token: string, user: User }): Promise<Session> {
    const session = new Session();
    session.token = token;
    session.user = user;
    session.expiredAt = this.dateHelper.addDays(new Date(), Number(TOKEN_DURATION));
    return this.sessionEntityRepository.save(session);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userEntityRepository.findOne({ where: { email } });
  }

  async getUserByToken(token: string): Promise<User> {
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

  async getFtsAccountsByUserId(userId: string): Promise<FtsAccount[]> {
    return this.ftsAccountEntityRepository.find({ where: { userId } });
  }

  async addFtsAccountToUser({ user, ftsAccountData }: { user: User, ftsAccountData: FtsAccountDto }): Promise<FtsAccount> {
    const ftsAccount = new FtsAccount();
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

  async getRandomFtsAccount(): Promise<FtsAccount | null> {
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
  async getNextFtsAccountByUserId(userId: string): Promise<FtsAccount> {
    const exceededIds = await this.getUserAccountsWithExceededLimit(userId);
    const where: FindConditions<FtsAccount> = {
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

  async getFtsAccountForUser(userId: string): Promise<FtsAccount> {
    const hasUserFtsAccount = await this.hasUserFtsAccount(userId);
    let ftsAccount: FtsAccount;
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

  async incrementUserQueriesLimit({ userId, accountId, qrDto }: { userId: string; accountId: string; qrDto: FtsQrDto }): Promise<void> {
    let query = await this.getUserQueryUses(userId);
    if (query === undefined) {
      query = new UserQueryLimit();
      query.usingDay = new Date();
      query.queries = 0;
      query.userId = userId;
      query.usingHistory = [];
    }
    query.queries += 1;
    const billHash = getHash(qrDto);
    query.usingHistory.push({
      accountId,
      dateTime: new Date(),
      billHash,
    });
    if (query.usingHistory.filter(item => item.billHash === billHash).length > 1) {
      return;
    }
    await this.userQueryLimitEntityRepository.save(query);
  }

  async increaseUserQueryLimit(userId: string): Promise<void> {
    const query = await this.getUserQueryUses(userId);
    if (query) {
      query.queryLimit += 1;
      await this.userQueryLimitEntityRepository.save(query);
    }
  }

  async getUserQueryUses(userId: string): Promise<UserQueryLimit | undefined> {
    const currentDate = new Date();
    const nextDate = this.dateHelper.addDays(currentDate, 1);
    return this.userQueryLimitEntityRepository.findOne({
      where: {
        userId,
        usingDay: Between(currentDate, nextDate),
      },
    });
  }

  private async getUserAccountsWithExceededLimit(userId: string): Promise<string[]> {
    const userAccounts: Array<{ id: string }> = await this.ftsAccountEntityRepository.query(`
        SELECT fe.id
        FROM fts_account_entity fe
                 FULL JOIN fts_account_usings_entity us on fe.phone = us.phone
                 where fe."userId" = '${ userId }' and us.uses is not null and us.uses > 14
    `);
    return userAccounts.map(account => account.id);
  }
}
