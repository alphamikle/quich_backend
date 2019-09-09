import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { UserCredentialsDto } from '../user/dto/user-credentials.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SessionEntity } from '../user/entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const { ROUNDS } = process.env;

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(SessionEntity) private readonly sessionEntityRepository: Repository<SessionEntity>,
  ) {
  }

  async signUp({ email, password }: UserCredentialsDto): Promise<UserEntity> {
    const passwordHash: string = await this.getHashOf(password);
    return this.userService.createUser({ email, passwordHash });
  }

  async signIn(user: UserEntity): Promise<string> {
    const dateMark = Date.now();
    const token = await this.generateAuthToken({ dateMark, email: user.email });
    await this.userService.createSession({ token, user });
    return token;
  }

  async getHashOf(value: string): Promise<string> {
    return await hash(value, Number(ROUNDS) || 5);
  }

  async isHashValid(value: string, encrypted: string): Promise<boolean> {
    return await compare(value, encrypted);
  }

  async generateAuthToken({ dateMark, email }: { dateMark: number, email: string }): Promise<string> {
    return await this.getHashOf(dateMark.toString() + email);
  }

  async getSessionByToken(token: string): Promise<SessionEntity> {
    return await this.sessionEntityRepository.findOne({ where: { token } });
  }
}
