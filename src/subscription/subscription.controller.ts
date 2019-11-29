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
    console.log('GP Hook:', googlePlayHookDto);
    googlePlayHookDto = this.subscriptionService.decodeGPHData(googlePlayHookDto);
    console.log(googlePlayHookDto);
  }
}
