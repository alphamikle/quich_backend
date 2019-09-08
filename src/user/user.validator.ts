import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserValidator {
  constructor(
    @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
  ) {
  }

  async isUserExist(email: string): Promise<boolean> {
    const count: number = await this.userEntityRepository.count({ where: { email } });
    return count > 0;
  }

}
