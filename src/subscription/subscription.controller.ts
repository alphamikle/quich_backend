import { BadRequestException, Body, Controller, Logger, Post } from '@nestjs/common';
import { Metadata } from 'grpc';
import { SubscriptionService } from '~/subscription/subscription.service';
import { GooglePlayHookDto } from '~/subscription/dto/google-play-hook.dto';
import { GoogleApiService } from '~/subscription/google-api.service';
import { Sku } from '~/subscription/entities/subscription.entity';
import { SubscriptionValidator } from '~/subscription/subscription.validator';
import { PurchaseTokenDto } from '~/subscription/dto/purchase-token.dto';
import { INCORRECT_GOOGLE_PLAY_HOOK_DATA } from '~/helpers/text';
import { GRPC, securedGrpc } from '~/providers/decorators';
import { Empty } from '~/providers/empty';
import { SkuDto } from '~/subscription/dto/sku.dto';
import * as user from '~/proto-generated/user';
import { GooglePlayProduct } from '~/subscription/dto/google-play-product';
import { GooglePlaySubscriptionInfo } from '~/subscription/interface/google-api.interface';

@Controller('subscription')
export class SubscriptionController implements user.SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly googleApiService: GoogleApiService,
    private readonly subscriptionValidator: SubscriptionValidator,
  ) {
  }

  @Post()
  async googleSubscriptionHook(@Body() hookDto: GooglePlayHookDto) {
    const validationResult = this.subscriptionValidator.validateHokDto(hookDto);
    if (validationResult !== true) {
      Logger.error(`Invalid GooglePlay hook dto: ${ JSON.stringify(hookDto) }`, null, SubscriptionController.name);
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
    });
    subscription = this.subscriptionService.assignSubscriptionWithGooglePlaySubscriptionInfo({
      subscription,
      subscriptionInfo,
    });

    await this.subscriptionService.createSubscription(subscription);
    await this.subscriptionService.setUserFromOneSubscriptionToAllByToken(subscription.purchaseToken);
  }

  @securedGrpc
  async addUserToSubscriptionData({ purchaseToken }: PurchaseTokenDto, meta: Metadata): Promise<Empty> {
    const validationResult = await this.subscriptionValidator.isSubscriptionExist(purchaseToken);
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    await this.subscriptionService.setUserIdToSubscriptionsByToken({
      userId: meta.user.id,
      purchaseToken,
    });
    return new Empty();
  }

  @GRPC()
  async getGooglePlayProductInfo({ sku }: SkuDto): Promise<GooglePlayProduct> {
    const validationResult = this.subscriptionValidator.validateProductInfo(sku as Sku);
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    return this.googleApiService.getProductInfoBySku(sku as Sku);
  }

  @GRPC()
  async getGooglePlaySubscriptionInfo({ purchaseToken }: PurchaseTokenDto): Promise<GooglePlaySubscriptionInfo> {
    const validationResult = await this.subscriptionValidator.validateSubscriptionInfo({
      token: purchaseToken,
    });
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    return this.googleApiService.getSubscriptionInfo({
      token: purchaseToken,
    });
  }

  @securedGrpc
  async hasUserSubscriptionWithoutGooglePlay(request: Empty, meta: Metadata) {
    const activeSubscription = await this.subscriptionService.getUserSubscriptionInfo(meta.user.id);
    if (!activeSubscription) {
      throw new BadRequestException({ push: INCORRECT_GOOGLE_PLAY_HOOK_DATA });
    }
    return activeSubscription;
  }
}
