import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { DateHelper } from '../helpers/date.helper';

@Injectable()
export class AuthValidator {
  constructor(
    private readonly authService: AuthService,
    private readonly dateHelper: DateHelper,
  ) {
  }

  async isPasswordValid({ user, password }: { user: UserEntity, password: string }): Promise<boolean> {
    return await this.authService.isHashValid(password, user.password);
  }

  async isTokenValid(token: string): Promise<boolean> {
    const session = await this.authService.getSessionByToken(token);
    if (!session) {
      return false;
    }
    return !this.dateHelper.isPast(session.expiredAt);
  }
}
