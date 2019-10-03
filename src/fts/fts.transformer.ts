import { Injectable } from '@nestjs/common';
import { FtsFetchResponseBill } from './dto/fts-fetch-response/bill.dto';
import { BillDto } from '../bill/dto/bill.dto';
import { ShopDto } from '../shop/dto/shop.dto';
import { PurchaseDto } from '../purchase/dto/purchase.dto';
import { FtsFetchResponsePurchase } from './dto/fts-fetch-response/purchase.dto';
import { DateHelper } from '../helpers/date.helper';

@Injectable()
export class FtsTransformer {
  constructor(
    private readonly dateHelper: DateHelper,
  ) {
  }

  transformFtsBillToBillDto(ftsBill: FtsFetchResponseBill) {
    const billDto = new BillDto();
    billDto.billDate = new Date(ftsBill.dateTime);
    billDto.totalSum = ftsBill.totalSum / 100;
    billDto.shop = this.extractShopFromFtsBill(ftsBill);
    billDto.purchases = this.extractPurchasesFromFtsBill(ftsBill);
    return billDto;
  }

  private extractShopFromFtsBill(ftsBill: FtsFetchResponseBill): ShopDto {
    const shopDto = new ShopDto();
    shopDto.address = ftsBill.retailPlaceAddress || ftsBill.retailAddress;
    shopDto.tin = ftsBill.userInn;
    shopDto.title = ftsBill.retailPlace || ftsBill.user;
    return shopDto;
  }

  private extractPurchasesFromFtsBill(ftsBill: FtsFetchResponseBill): PurchaseDto[] {
    const ftsPurchases = ftsBill.items;
    const purchaseDtoS: PurchaseDto[] = [];
    for (const ftsPurchase of ftsPurchases) {
      purchaseDtoS.push(this.transformFtsPurchaseToPurchaseDto(ftsPurchase));
    }
    return purchaseDtoS;
  }

  private transformFtsPurchaseToPurchaseDto(ftsPurchase: FtsFetchResponsePurchase) {
    const purchaseDto = new PurchaseDto();
    purchaseDto.price = ftsPurchase.price / 100;
    purchaseDto.quantity = ftsPurchase.quantity;
    purchaseDto.title = ftsPurchase.name;
    return purchaseDto;
  }
}
