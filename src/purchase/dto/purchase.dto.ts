import * as purchase from '~/proto-generated/purchase';

export class PurchaseDto implements purchase.PurchaseDto {

  id?: string;

  title!: string;

  price!: number;

  quantity!: number;

  rate?: number;

  categoryId?: string;

  isValid?: boolean;
}
