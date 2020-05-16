import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user';
import { FtsAccountEntity } from './entities/fts-account.entity';

@Injectable()
export class UserValidator {
  constructor(
    @InjectRepository(User) private readonly userEntityRepository: Repository<User>,
    @InjectRepository(FtsAccountEntity) private readonly ftsAccountEntityRepository: Repository<FtsAccountEntity>,
  ) {
  }

  async isUserExist(email: string): Promise<boolean> {
    const count: number = await this.userEntityRepository.count({ where: { email } });
    return count > 0;
  }

  async isFtsAccountExistOnUser({ user, phone }: { user: User, phone: string }): Promise<boolean> {
    const count: number = await this.ftsAccountEntityRepository.count({
      where: {
        user,
        phone,
      },
    });
    return count > 0;
  }

}
