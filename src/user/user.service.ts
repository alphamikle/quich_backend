import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SessionEntity } from './entities/session.entity';
import { DateHelper } from '../helpers/date.helper';
import { FtsAccountEntity } from './entities/fts-account.entity';
import { FtsAccountDto } from '../fts/dto/fts-account.dto';
import { FtsAccountQueueEntity } from './entities/fts-account-queue.entity';
import { FTS_ACCOUNTS_ALL_BUSY_ERROR } from '../helpers/text';

const { TOKEN_DURATION } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity) private readonly sessionEntityRepository: Repository<SessionEntity>,
    @InjectRepository(FtsAccountEntity) private readonly ftsAccountEntityRepository: Repository<FtsAccountEntity>,
    @InjectRepository(FtsAccountQueueEntity) private readonly ftsAccountQueueEntityRepository: Repository<FtsAccountQueueEntity>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async setUserPassword({ user, password }: { user: UserEntity, password: string }): Promise<UserEntity> {
    user.password = password;
    return this.userEntityRepository.save(user);
  }

  async getFtsAccountById(ftsAccountId: string): Promise<FtsAccountEntity> {
    return this.ftsAccountEntityRepository.findOne(ftsAccountId);
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
    const session = await this.sessionEntityRepository.findOne({ where: { token }, relations: [ 'user' ] });
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
    const otherAccounts = await this.getFtsAccountsByUserId(user.id);
    ftsAccount.isMain = otherAccounts.length === 0;
    return this.ftsAccountEntityRepository.save(ftsAccount);
  }

  async deleteFtsAccountFromUser({ userId, phone }: { userId: string, phone: string }): Promise<void> {
    await this.ftsAccountEntityRepository.delete({ userId, phone });
  }

  async makeFtsAccountMain({ user, phone }: { user: UserEntity, phone: string }): Promise<void> {
    await this.ftsAccountEntityRepository.update({ user }, { isMain: false });
    await this.ftsAccountEntityRepository.update({ user, phone }, { isMain: true });
  }

  /**
   * @description Возвращает последние N элементов из очереди использования аккаунтов ФНС
   * @param ftsAccountsIds
   */
  async getFtsAccountsQueue(ftsAccountsIds: string[]): Promise<string[]> {
    if (ftsAccountsIds.length === 0) {
      return [];
    }
    const lastUsedAccounts = await this.ftsAccountQueueEntityRepository.find({
      where: { ftsAccountId: In(ftsAccountsIds) },
      take: ftsAccountsIds.length - 1,
      order: { useDateTime: 'DESC' },
    });
    return lastUsedAccounts.map(account => account.ftsAccountId);
  }

  async addFtsAccountIdToQueue(ftsAccountId: string): Promise<void> {
    const ftsAccountQueue = new FtsAccountQueueEntity();
    ftsAccountQueue.ftsAccountId = ftsAccountId;
    await this.ftsAccountQueueEntityRepository.save(ftsAccountQueue);
  }

  async hasUserFtsAccount(userId: string): Promise<boolean> {
    const count = await this.ftsAccountEntityRepository.count({ where: { userId } });
    return count > 0;
  }

  /**
   * @description Выбирает рандомный аккаунт ФНС, у которого менее 10 использований за последние 2 дня
   * и наименьшее количество использований за эти 2 дня
   */
  async getRandomFtsAccount(): Promise<FtsAccountEntity | null> {
    const currentDate = new Date();
    const pastTwoDaysDate = this.dateHelper.subDays(currentDate, 2);
    const lessUsedFtsAccountsIds: Array<{ ftsAccountId: string, countPerDays: number }> = await this.ftsAccountQueueEntityRepository.query(`
    SELECT ftsAccountId,
    (SELECT COUNT(ftsAccountId) FROM fts_account_queue_entity subQe WHERE subQe.useDateTime (BETWEEN ${ pastTwoDaysDate } AND ${ currentDate })
    AND subQe.ftsAccountId = qe.ftsAccountId) as countPerDays
    FROM fts_account_queue_entity qe
    WHERE countPerDays < 10
    ORDER BY countPerDays ASC
    `);
    if (lessUsedFtsAccountsIds.length === 0) {
      return null;
    }
    const onlyIds = lessUsedFtsAccountsIds.map(item => item.ftsAccountId);
    return this.ftsAccountEntityRepository.findOne(onlyIds[ 0 ]);
  }

  /**
   * @description Выбирает из списка аккаунтов ФНС пользователя тот, что использовался раньше всех
   * @param userId
   */
  async getNextFtsAccountByUserId(userId: string): Promise<FtsAccountEntity> {
    const userFtsAccounts = await this.getFtsAccountsByUserId(userId);
    const lastUsedAccountsIds = await this.getFtsAccountsQueue(userFtsAccounts.map(account => account.id));
    const mostUnusedAccounts = userFtsAccounts.filter(account => !lastUsedAccountsIds.some(accountId => account.id === accountId));
    if (mostUnusedAccounts.length === 0) {
      return userFtsAccounts[ 0 ];
    }
    return mostUnusedAccounts[ 0 ];
  }

  async getFtsAccountForUser(userId: string): Promise<FtsAccountEntity> {
    const hasUserFtsAccount = await this.hasUserFtsAccount(userId);
    let ftsAccount: FtsAccountEntity;
    if (hasUserFtsAccount) {
      ftsAccount = await this.getNextFtsAccountByUserId(userId);
    } else {
      ftsAccount = await this.getRandomFtsAccount();
    }
    if (!ftsAccount) {
      throw new BadRequestException({ push: FTS_ACCOUNTS_ALL_BUSY_ERROR });
    }
    await this.addFtsAccountIdToQueue(ftsAccount.id);
    return ftsAccount;
  }
}
