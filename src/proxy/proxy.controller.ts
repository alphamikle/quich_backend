import { Query }                    from '@nestjs/common';
import { ProxyService }             from './proxy.service';
import { GetAction, TagController } from '../helpers/decorators';

@TagController('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {
  }

  @GetAction('Прогрев прокси', null, 'warm')
  async warmProxies(@Query('limit') limit?: number, @Query('iterations') iterations?: number): Promise<void> {
    if (limit !== undefined) {
      limit = Number(limit);
    }
    if (iterations !== undefined) {
      iterations = Number(iterations);
    }
    await this.proxyService.warmProxies(limit, iterations);
  }
}
