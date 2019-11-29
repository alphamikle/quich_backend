import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GooglePlayHookDto } from './dto/google-play-hook.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  @ApiOperation({ title: 'Роут для получения web-хуков о статусе платежей от Google Play' })
  @ApiResponse({
    status: 201,
    type: String,
  })
  async googleSubscriptionHook(@Body() googlePlayHookDto: GooglePlayHookDto) {
    console.log(`Get GP hook ${new Date()}`);
    googlePlayHookDto = this.subscriptionService.decodeGPHData(googlePlayHookDto);
    const subscription = this.subscriptionService.generateAndroidSubscription({
      userId: '01147b9b-02f4-44dd-8eb8-ab6684d87896',
      activeFrom: new Date(),
      activeTo: new Date(2020),
      rawBody: googlePlayHookDto,
    });
    await this.subscriptionService.createSubscription(subscription);
  }
}
