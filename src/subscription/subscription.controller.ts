import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  async googleSubscriptionHook(@Body() body: any) {
    console.log('GP Hook:', body);
  }
}
