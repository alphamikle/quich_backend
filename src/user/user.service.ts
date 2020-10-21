import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { User } from '~/user/entities/user.entity';
import { Session } from '~/user/entities/session.entity';
import { DateHelper } from '~/helpers/date.helper';
import { UserQueryLimit } from '~/user/entities/user-query-limit.entity';
import { FtsQrDto } from '~/fts/dto/fts-qr.dto';
import { getHash } from '~/helpers/common.helper';
import { EsiaAuthDto } from '~/user/dto/esia-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionEntityRepository: Repository<Session>,
    @InjectRepository(UserQueryLimit)
    private readonly userQueryLimitEntityRepository: Repository<UserQueryLimit>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async createSession({ token, user }: { token: string, user: User }): Promise<Session> {
    const session = new Session();
    session.token = token;
    session.user = user;
    return this.sessionEntityRepository.save(session);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userEntityRepository.findOne({ where: { email } });
  }

  async getUserByPhoneAndEmail({ phone, email }: { phone: string; email: string }): Promise<User | null> {
    const userByEmail = await this.userEntityRepository.findOne({ where: { email } });
    const userByPhone = await this.userEntityRepository.findOne({ where: { phone } });
    if (userByEmail?.id === userByPhone?.id) {
      return userByPhone;
    }
    Logger.error(`user with different phone or email, ${userByPhone}, ${userByEmail}`);
    return null;
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

  private async createUserFromEsiaAuthData(esiaAuthData: EsiaAuthDto): Promise<User> {
    const user: User = new User();
    user.phone = esiaAuthData.phone;
    user.email = esiaAuthData.email;
    user.lastname = esiaAuthData.lastname;
    user.name = esiaAuthData.name;
    return this.userEntityRepository.save(user);
  }

  async createOrFindUserByOAuthData(esiaAuthData: EsiaAuthDto): Promise<User> {
    let user: User | null = await this.getUserByPhoneAndEmail({ phone: esiaAuthData.phone, email: esiaAuthData.email });
    if (user === null) {
      user = await this.createUserFromEsiaAuthData(esiaAuthData);
    }
    await this.createSession({ token: esiaAuthData.sessionId, user });
    return user;
  }
}
