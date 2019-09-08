import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { UserCredentialsDTO } from './dto/userCredentials.dto';
import { SessionEntity } from './entities/session.entity';
import { DateHelper } from '../common/date.helper';

const { TOKEN_DURATION } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity) private readonly sessionEntityRepository: Repository<SessionEntity>,
    private readonly authService: AuthService,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async signUp({ email, password }: UserCredentialsDTO): Promise<UserEntity> {
    const user = new UserEntity();
    user.email = email;
    user.password = await this.authService.getHashOf(password);
    return await this.userEntityRepository.save(user);
  }

  async signIn(user: UserEntity): Promise<string> {
    const dateMark = Date.now();
    const token = await this.authService.generateAuthToken({ dateMark, email: user.email });
    await this.createSession({ token, user });
    return token;
  }

  async createSession({ token, user }): Promise<SessionEntity> {
    const session = new SessionEntity();
    session.token = token;
    session.user = user;
    session.expiredAt = this.dateHelper.addDays(new Date(), Number(TOKEN_DURATION));
    return await this.sessionEntityRepository.save(session);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userEntityRepository.findOne({ where: { email } });
  }
}
