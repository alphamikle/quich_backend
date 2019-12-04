import { BadRequestException, Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { GooglePlayHookDto } from './dto/google-play-hook.dto';
import { GoogleApiService } from './google-api.service';
import { Sku } from './entities/subscription.entity';
import { SubscriptionValidator } from './subscription.validator';
import { Guards } from '../helpers/guards';
import { RequestUser } from '../user/user.decorator';
import { UserEntity } from '../user/entities/user.entity';
import { UserPurchaseAssignDto } from './dto/user-purchase-assign.dto';

@ApiUseTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly googleApiService: GoogleApiService,
    private readonly subscriptionValidator: SubscriptionValidator,
  ) {
  }

  @Post()
  @ApiOperation({ title: 'Роут для получения web-хуков о статусе платежей от Google Play' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async googleSubscriptionHook(@Body() hookDto: GooglePlayHookDto) {
    const validationResult = this.subscriptionValidator.validateHokDto(hookDto);
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    hookDto = this.subscriptionService.extractAdditionalData(hookDto);
    const product = await this.googleApiService.getProductInfoBySku(hookDto.sku);
    hookDto = this.subscriptionService.addEndDate({ hookDto, product });

    let subscription = this.subscriptionService.generateAndroidSubscription({
      activeFrom: hookDto.actionDate,
      activeTo: hookDto.endDate,
      hookRawBody: hookDto,
    });

    const subscriptionInfo = await this.googleApiService.getSubscriptionInfo({ token: subscription.purchaseToken, sku: hookDto.sku });
    subscription = this.subscriptionService.assignSubscriptionWithGooglePlaySubscriptionInfo({ subscription, subscriptionInfo });

    await this.subscriptionService.createSubscription(subscription);
    await this.subscriptionService.setUserFromOneSubscriptionToAllByToken(subscription.purchaseToken);
  }

  @UseGuards(Guards)
  @ApiBearerAuth()
  @Patch()
  @ApiOperation({ title: 'Связывание данных подписки и пользователя' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async addUserToSubscriptionData(@RequestUser() user: UserEntity, @Body() purchaseAssignDto: UserPurchaseAssignDto) {
    const lastSubscriptionInfo = await this.subscriptionService.getLastSubscriptionByPurchaseToken(purchaseAssignDto.purchaseToken);
    await this.subscriptionService.setUserIdToSubscriptionsByToken({ userId: user.id, purchaseToken: purchaseAssignDto.purchaseToken });
  }

  @Get('product')
  @ApiOperation({ title: 'Получение информации о продукте по Sku' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async getGooglePlayProductInfo(@Param('sku') sku: Sku) {
    const validationResult = this.subscriptionValidator.validateProductInfo(sku);
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    return this.googleApiService.getProductInfoBySku(sku);
  }

  @Get('subscription/:token/:sku')
  @ApiOperation({ title: 'Получение информации о подписке' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  async getGooglePlaySubscriptionInfo(@Param('token') token: string, @Param('sku') sku: Sku) {
    const validationResult = await this.subscriptionValidator.validateSubscriptionInfo({ token, sku });
    if (validationResult !== true) {
      throw new BadRequestException(validationResult);
    }
    return this.googleApiService.getSubscriptionInfo({ token, sku });
  }
}
