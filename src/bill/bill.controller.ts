import { Controller } from '@nestjs/common';
import { Metadata } from 'grpc';
import { User } from '~/user/entities/user.entity';
import { BillRequestService } from '~/bill-request/bill-request.service';
import { FtsService } from '~/fts/fts.service';
import { UserService } from '~/user/user.service';
import { FtsTransformer } from '~/fts/fts.transformer';
import { BillDto } from '~/bill/dto/bill.dto';
import { OfdService } from '~/ofd/ofd.service';
import { ShopService } from '~/shop/shop.service';
import { PurchaseService } from '~/purchase/purchase.service';
import { BillService } from '~/bill/bill.service';
import { Bill } from '~/bill/entities/bill.entity';
import { DateHelper } from '~/helpers/date.helper';
import { SubscriptionValidator } from '~/subscription/subscription.validator';
import { BillProviderService } from '~/bill-provider/bill-provider.service';
import { securedGrpc } from '~/providers/decorators';
import { Bills } from '~/bill/dto/bills.dto';
import * as bill from '~/proto-generated/bill';
import { Empty } from '~/providers/empty';
import { BillIdDto } from '~/bill/dto/bill-id.dto';
import { ProviderCode } from '~/bill-provider/entities/bill-provider.entity';
import { rpcJsonException } from '~/providers/rpc-json-exception';
import { PropertyError } from '~/providers/property-error';

@Controller()
export class BillController implements bill.BillController {
  private billRequestIdCache: Map<string, string> = new Map();

  constructor(
    private readonly billRequestService: BillRequestService,
    private readonly ftsService: FtsService,
    private readonly ftsTransformer: FtsTransformer,
    private readonly userService: UserService,
    private readonly ofdService: OfdService,
    private readonly shopService: ShopService,
    private readonly purchaseService: PurchaseService,
    private readonly billService: BillService,
    private readonly dateHelper: DateHelper,
    private readonly subscriptionValidator: SubscriptionValidator,
    private readonly providerService: BillProviderService,
  ) {
  }

  @securedGrpc
  async getUserBills(request: Empty, { user }: Metadata): Promise<Bills> {
    return new Bills(await this.billService.getUserBills(user.id));
  }

  @securedGrpc
  async createBill(request: BillDto, { user }: Metadata): Promise<Bill> {
    const shop = await this.shopService.findOrCreateShop(request.shop);
    const newBill = await this.billService.createBillForUser({
      billDto: request,
      shopId: shop.id,
      userId: user.id,
    });
    // ? Пояснение:
    /** Избавился от Promise.all, потому что в одном чеке может
     * быть два продукта с одинаковым названием, но разной ценой
     * и сохранится только один из них
     */
    for await (const purchaseDto of request.purchases) {
      await this.purchaseService.createPurchase({
        purchaseDto,
        billId: newBill.id,
      });
    }
    if (request.billRequestId) {
      await this.billRequestService.setBillIdToBillRequest({
        billRequestId: request.billRequestId,
        billId: newBill.id,
      });
    }
    return newBill;
  }

  @securedGrpc
  async editBill(request: BillDto, meta: Metadata): Promise<Bill> {
    const billEntity = await this.billService.getBillById(request.id);
    const shop = await this.shopService.editShop(request.shop);
    request.shop.id = shop.id;
    const editedBill = await this.billService.editBill({
      billDto: request,
      billEntity,
    });
    await this.purchaseService.editPurchases({
      purchases: request.purchases,
      billId: request.id,
    });
    return editedBill;
  }

  @securedGrpc
  async deleteBill({ billId }: BillIdDto, meta: Metadata): Promise<Empty> {
    await this.billService.deleteBill(billId);
    return new Empty();
  }

  private async makeBillRequestFetched(billRequestId: string, providerCode: ProviderCode): Promise<void> {
    const billProvider = await this.providerService.extractBillProvider(providerCode ?? ProviderCode.FTS);
    await this.billRequestService.makeBillRequestFetched(billRequestId, billProvider.id);
  }

  private validateLimits(user: User): void {
    const validateResult = this.subscriptionValidator.validateUserUsingLimits(user);
    if (validateResult !== true) {
      throw rpcJsonException(PropertyError.fromObject(validateResult));
    }
  }
}
