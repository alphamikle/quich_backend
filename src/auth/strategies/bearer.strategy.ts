import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy }                          from '@nestjs/passport';
import { IVerifyOptions, Strategy }                  from 'passport-http-bearer';
import { AuthValidator }                             from '../auth.validator';
import { UNAUTHORIZED }                              from '../../helpers/text';
import { UserService }                               from '../../user/user.service';
import { UserEntity }                                from '../../user/entities/user.entity';
import { SubscriptionService }                       from '../../subscription/subscription.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authValidator: AuthValidator,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    super();
  }

  async validate(token: string, done: (error: typeof Error, user?: UserEntity, options?: IVerifyOptions | string) => void): Promise<void> {
    const isTokenValid = await this.authValidator.isTokenValid(token);
    if (!isTokenValid) {
      await this.userService.makeSessionInvalid(token);
      throw new UnauthorizedException({ push: UNAUTHORIZED });
    }
    const user = await this.userService.getUserByToken(token);
    const subscriptionInfoDto = await this.subscriptionService.getUserSubscriptionInfo(user.id);
    user.hasPurchase = Boolean(subscriptionInfoDto && subscriptionInfoDto.activeTo.valueOf() > Date.now());
    const queryUsesEntity = await this.userService.getUserQueryUses(user.id);
    user.queryUses = queryUsesEntity === undefined
      ?
      0
      :
      queryUsesEntity.queries;
    Logger.debug(`User ${JSON.stringify(user)} used api`);
    done(null, user);
  }

}
