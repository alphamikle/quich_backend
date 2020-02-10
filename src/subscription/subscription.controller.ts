import { BadRequestException, Body, Param }                                         from '@nestjs/common';
import { SubscriptionService }                                                      from './subscription.service';
import { GooglePlayHookDto }                                                        from './dto/google-play-hook.dto';
import { GoogleApiService }                                                         from './google-api.service';
import { Sku }                                                                      from './entities/subscription.entity';
import { SubscriptionValidator }                                                    from './subscription.validator';
import { RequestUser }                                                              from '../user/user.decorator';
import { UserEntity }                                                               from '../user/entities/user.entity';
import { UserPurchaseAssignDto }                                                    from './dto/user-purchase-assign.dto';
import { SubscriptionInfoDto }                                                      from './dto/subscription-info.dto';
import { INCORRECT_GOOGLE_PLAY_HOOK_DATA }                                          from '../helpers/text';
import { GetAction, PostAction, SecureGetAction, SecurePatchAction, TagController } from '../helpers/decorators';

@TagController('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly googleApiService: GoogleApiService,
    private readonly subscriptionValidator: SubscriptionValidator,
  ) {
  }

  @PostAction('Роут для получения web-хуков о статусе платежей от Google Play', String)
  async googleSubscriptionHook(@Body() hookDto: GooglePlayHookDto) {
    const validationResult = this.subscriptionValidator.validateHokDto(hookDto);
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    hookDto = this.subscriptionService.extractAdditionalData(hookDto);
    const fallbackStartDate = new Date(1990, 1, 1);
    const fallbackEndDate = new Date(2030, 1, 1);

    let subscription = this.subscriptionService.generateAndroidSubscription({
      activeFrom: fallbackStartDate,
      activeTo: fallbackEndDate,
      hookRawBody: hookDto,
    });

    const subscriptionInfo = await this.googleApiService.getSubscriptionInfo({
      token: subscription.purchaseToken,
      sku: hookDto.sku,
    });
    subscription = this.subscriptionService.assignSubscriptionWithGooglePlaySubscriptionInfo({
      subscription,
      subscriptionInfo,
    });

    await this.subscriptionService.createSubscription(subscription);
    await this.subscriptionService.setUserFromOneSubscriptionToAllByToken(subscription.purchaseToken);
  }

  @SecurePatchAction('Связывание данных подписки и пользователя', String)
  async addUserToSubscriptionData(@RequestUser() user: UserEntity, @Body() purchaseAssignDto: UserPurchaseAssignDto) {
    const { purchaseToken } = purchaseAssignDto;
    const validationResult = await this.subscriptionValidator.isSubscriptionExist(purchaseToken);
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    // const haveUserThisSubscription = await this.subscriptionService.isSubscriptionActiveAndBelongsToUser({ userId: user.id, purchaseToken });
    // if (!haveUserThisSubscription) {
    //   const subscription = await this.subscriptionService.getLastSubscriptionByPurchaseToken(purchaseToken);
    //   if (subscription.isActive) {
    //
    //   }
    // }
    await this.subscriptionService.setUserIdToSubscriptionsByToken({
      userId: user.id,
      purchaseToken,
    });
  }

  @GetAction('Получение информации о продукте по Sku', String, 'product')
  async getGooglePlayProductInfo(@Param('sku') sku: Sku) {
    const validationResult = this.subscriptionValidator.validateProductInfo(sku);
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    return this.googleApiService.getProductInfoBySku(sku);
  }

  @GetAction('Получение информации о подписке', String, 'subscription/:token/:sku')
  async getGooglePlaySubscriptionInfo(@Param('token') token: string, @Param('sku') sku: Sku) {
    const validationResult = await this.subscriptionValidator.validateSubscriptionInfo({
      token,
      sku,
    });
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    return this.googleApiService.getSubscriptionInfo({
      token,
      sku,
    });
  }

  @SecureGetAction('Проверка наличия у пользователя активной подписки', SubscriptionInfoDto, 'subscription/is-active')
  async hasUserSubscriptionWithoutGooglePlay(@RequestUser() user: UserEntity) {
    const activeSubscription = await this.subscriptionService.getUserSubscriptionInfo(user.id);
    if (!activeSubscription) {
      throw new BadRequestException({ push: INCORRECT_GOOGLE_PLAY_HOOK_DATA });
    }
    return activeSubscription;
  }
}
