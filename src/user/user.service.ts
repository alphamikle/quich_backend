import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SessionEntity } from './entities/session.entity';
import { DateHelper } from '../helpers/date.helper';
import { FtsAccountEntity } from './entities/fts-account.entity';
import { FtsAccountDto } from '../fts/dto/fts-account.dto';

const { TOKEN_DURATION } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity) private readonly sessionEntityRepository: Repository<SessionEntity>,
    @InjectRepository(FtsAccountEntity) private readonly ftsAccountEntityRepository: Repository<FtsAccountEntity>,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async createUser({ email, passwordHash }: { email: string, passwordHash: string }): Promise<UserEntity> {
    const user = new UserEntity();
    user.email = email;
    user.password = passwordHash;
    return await this.userEntityRepository.save(user);
  }

  async createSession({ token, user }: { token: string, user: UserEntity }): Promise<SessionEntity> {
    const session = new SessionEntity();
    session.token = token;
    session.user = user;
    session.expiredAt = this.dateHelper.addDays(new Date(), Number(TOKEN_DURATION));
    return await this.sessionEntityRepository.save(session);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userEntityRepository.findOne({ where: { email } });
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
    return await this.ftsAccountEntityRepository.save(ftsAccount);
  }

  async deleteFtsAccountFromUser({ user, phone }: { user: UserEntity, phone: string }): Promise<void> {
    await this.ftsAccountEntityRepository.delete({ user, phone });
  }

  async makeFtsAccountMain({ user, phone }: { user: UserEntity, phone: string }): Promise<void> {
    await this.ftsAccountEntityRepository.update({ user }, { isMain: false });
    await this.ftsAccountEntityRepository.update({ user, phone }, { isMain: true });
  }
}
