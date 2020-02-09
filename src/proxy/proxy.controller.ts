import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';

@ApiUseTags('proxy')
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {
  }

  @ApiOperation({
    title: 'Прогрев прокси',
  })
  @Get('warm')
  async warmProxies(
    @Query('limit') limit?: number,
    @Query('iterations') iterations?: number,
  ): Promise<void> {
    if (limit !== undefined) {
      limit = Number(limit);
    }
    if (iterations !== undefined) {
      iterations = Number(iterations);
    }
    await this.proxyService.warmProxies(limit, iterations);
  }
}
