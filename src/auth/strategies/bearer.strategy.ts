import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IVerifyOptions, Strategy } from 'passport-http-bearer';
import { AuthValidator } from '../auth.validator';
import { UNAUTHORIZED } from '../../helpers/text';
import { UserService } from '../../user/user.service';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authValidator: AuthValidator,
    private readonly userService: UserService,
  ) {
    super();
  }

  async validate(token: string, done: (error: any, user?: UserEntity, options?: IVerifyOptions | string) => void): Promise<void> {
    const isTokenValid = await this.authValidator.isTokenValid(token);
    if (!isTokenValid) {
      await this.userService.makeSessionInvalid(token);
      throw new UnauthorizedException({ push: UNAUTHORIZED });
    }
    const user = await this.userService.getUserByToken(token);
    done(null, user);
  }

}
