import { SkuCode } from '~/subscription/entities/subscription.entity';
import * as user from '~/proto-generated/user';

export class SkuDto implements user.SkuDto {
  sku!: string;

  skuCode!: SkuCode;
}