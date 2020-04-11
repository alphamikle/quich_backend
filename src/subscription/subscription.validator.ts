import { Injectable }                                                                                           from '@nestjs/common';
import { InjectRepository }                                                                                     from '@nestjs/typeorm';
import { Repository }                                                                                           from 'typeorm';
import { GooglePlayHookDto }                                                                                    from './dto/google-play-hook.dto';
import { INCORRECT_GOOGLE_PLAY_HOOK_DATA, SUBSCRIPTION_NOT_EXIST, UNKNOWN_ERROR, YOU_NEED_TO_BUY_SUBSCRIPTION } from '../helpers/text';
import { Sku, SubscriptionEntity }                                                                              from './entities/subscription.entity';
import { UserEntity }                                                                                           from '../user/entities/user.entity';

const { GOOGLE_PLAY_HOOK_THEME } = process.env;

@Injectable()
export class SubscriptionValidator {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionEntityRepository: Repository<SubscriptionEntity>,
  ) {
  }

  validateHokDto(hookDto: GooglePlayHookDto): true | { push: string } {
    const error: { push: string } = { push: INCORRECT_GOOGLE_PLAY_HOOK_DATA };
    const isHook = Boolean(hookDto);
    const isCorrectTheme = hookDto?.subscription === GOOGLE_PLAY_HOOK_THEME;
    const isCorrectData = Boolean(hookDto?.message?.data);
    return isHook && isCorrectTheme && isCorrectData || error;
  }

  validateProductInfo(sku: Sku): true | { push: string } {
    const error = { push: UNKNOWN_ERROR };
    return Boolean(sku in Sku) || error;
  }

  async isSubscriptionExist(purchaseToken: string): Promise<{ push: string } | true> {
    const isExist = (await this.subscriptionEntityRepository.count({ where: { purchaseToken } })) > 0;
    if (!isExist) {
      return { push: SUBSCRIPTION_NOT_EXIST };
    }
    return true;
  }

  async validateSubscriptionInfo({ token, sku }: { token: string; sku: Sku }): Promise<true | { push: string }> {
    const error = { push: UNKNOWN_ERROR };
    const isSkuExist = this.validateProductInfo(sku) === true;
    const isTokenExist = await this.isSubscriptionExist(token);
    return isSkuExist && isTokenExist === true || error;
  }

  validateUserUsingLimits(user: UserEntity): true | { push: string } {
    if (!user.hasPurchase && user.queryUses >= user.queryUsesLimits) {
      return {
        push: YOU_NEED_TO_BUY_SUBSCRIPTION,
      };
    }
    return true;
  }
}
