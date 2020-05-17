import { ShopDto } from '~/shop/dto/shop.dto';
import { PurchaseDto } from '~/purchase/dto/purchase.dto';
import * as bill from '~/proto-generated/bill';
import { ProviderCode } from '~/bill-provider/entities/bill-provider.entity';

export class BillDto implements bill.BillDto {

  id?: string;

  shop!: ShopDto;

  billDate!: Date;

  date?: string;

  time?: string;

  comment?: string;

  totalSum!: number;

  purchases!: PurchaseDto[];

  billRequestId?: string;

  providerCode?: ProviderCode;
}
