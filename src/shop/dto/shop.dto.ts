import * as shop from '~/proto-generated/shop';

export class ShopDto implements shop.ShopDto {

  id?: string;


  title!: string;


  tin!: string;


  address!: string;
}
