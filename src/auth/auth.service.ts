import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '~/user/user.service';
import { Session } from '~/user/entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(Session)
    private readonly sessionEntityRepository: Repository<Session>,
  ) {
  }

  async isHashValid(value: string, encrypted: string): Promise<boolean> {
    return compare(value, encrypted);
  }

  async isSessionValid(session: Session): Promise<boolean> {
    return true;
  }

  async getSessionByToken(token: string): Promise<Session> {
    return this.sessionEntityRepository.findOne({ where: { token } });
  }
}
