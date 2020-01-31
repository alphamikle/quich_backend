import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { FtsAccountEntity } from './entities/fts-account.entity';

@Injectable()
export class UserValidator {
  constructor(
    @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(FtsAccountEntity) private readonly ftsAccountEntityRepository: Repository<FtsAccountEntity>,
  ) {
  }

  async isUserExist(email: string): Promise<boolean> {
    const count: number = await this.userEntityRepository.count({ where: { email } });
    return count > 0;
  }

  async isFtsAccountExistOnUser({ user, phone }: { user: UserEntity, phone: string }): Promise<boolean> {
    const count: number = await this.ftsAccountEntityRepository.count({ where: { user, phone } });
    return count > 0;
  }

}
