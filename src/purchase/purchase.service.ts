import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Purchase } from '~/purchase/entities/purchase.entity';
import { PurchaseDto } from '~/purchase/dto/purchase.dto';
import { ProductService } from '~/product/product.service';
import { Product } from '~/product/entities/product.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseEntityRepository: Repository<Purchase>,
    private readonly productService: ProductService,
  ) {
  }

  async getPurchaseById(id: string): Promise<Purchase> {
    return this.purchaseEntityRepository.findOne(id);
  }

  async updateUserPurchasesCategoryId({ oldCategoryId, newCategoryId, userId }: { oldCategoryId: string, newCategoryId: string, userId: string }) {
    const purchases = await this.getUserPurchases(userId);
    const ids = purchases.map(purchase => purchase.id);
    if (ids.length) {
      await this.purchaseEntityRepository.update({
        categoryId: oldCategoryId,
        id: In(ids),
      }, { categoryId: newCategoryId });
    }
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    const purchases: Purchase[] = await this.purchaseEntityRepository.query(`
      SELECT pe.id, pe."billId", pe."categoryId", pe."createdAt", pe.price, pe.quantity, pe.rate, pe."productId"
      FROM purchase_entity pe
        LEFT JOIN bill_entity be on pe."billId" = be.id
        WHERE be."userId" = '${ userId }'
    `);
    return purchases;
  }

  async createPurchase({ purchaseDto, billId }: { purchaseDto: PurchaseDto, billId: string }): Promise<Purchase> {
    const product = await this.productService.findOrCreateProductByTitleOrId({
      title: purchaseDto.title,
      id: purchaseDto.id,
    });
    const purchase = new Purchase();
    purchase.categoryId = purchaseDto.categoryId;
    purchase.price = purchaseDto.price;
    purchase.productId = product.id;
    purchase.quantity = purchaseDto.quantity;
    purchase.rate = purchaseDto.rate;
    purchase.billId = billId;
    return this.purchaseEntityRepository.save(purchase);
  }

  async getPurchasesByBillId(billId: string): Promise<Purchase[]> {
    return this.purchaseEntityRepository.find({ where: { billId } });
  }

  async deleteOutdatedPurchasesByIds({ purchasesIds, billId }: { purchasesIds: string[], billId: string }) {
    if (purchasesIds.length > 0) {
      await this.purchaseEntityRepository.delete({
        id: Not(In(purchasesIds)),
        billId,
      });
    }
  }

  async editPurchases({ purchases, billId }: { purchases: PurchaseDto[], billId: string }): Promise<Purchase[]> {
    const currentPurchasesIds: string[] = [];
    const editedPurchases = await Promise.all(purchases.map(purchaseDto => this.editPurchase({
      purchaseDto,
      billId,
    })));
    currentPurchasesIds.push(...editedPurchases.map(purchaseEntity => purchaseEntity.id));
    await this.deleteOutdatedPurchasesByIds({
      purchasesIds: currentPurchasesIds,
      billId,
    });
    return editedPurchases;
  }

  async editPurchase({ purchaseDto, billId }: { purchaseDto: PurchaseDto, billId: string }): Promise<Purchase> {
    let purchaseEntity: Purchase;
    let product: Product;
    if (purchaseDto.id) {
      purchaseEntity = await this.getPurchaseById(purchaseDto.id);
    }
    if (purchaseEntity) {
      product = await this.productService.getProductById(purchaseEntity.productId);
      if (purchaseDto.title !== product.title) {
        product = await this.productService.findOrCreateProductByTitleOrId({
          title: purchaseDto.title,
          id: null,
        });
        purchaseEntity.productId = product.id;
      }
      purchaseEntity.categoryId = purchaseDto.categoryId;
      purchaseEntity.price = purchaseDto.price;
      purchaseEntity.quantity = purchaseDto.quantity;
      purchaseEntity = await this.purchaseEntityRepository.save(purchaseEntity);
    } else {
      purchaseEntity = await this.createPurchase({
        purchaseDto,
        billId,
      });
    }
    return purchaseEntity;
  }

  async getClosestCategoryIdByProductTitle({ title, products }: { title: string, products: Product[] }): Promise<string | null> {
    const closestProduct = await this.productService.getClosestProductByTitle({
      title,
      products,
    });
    if (!closestProduct) {
      return null;
    }
    const closestPurchase = await this.purchaseEntityRepository.findOne({
      where: { productId: closestProduct.id },
      order: { createdAt: 'DESC' },
    });
    if (!closestPurchase) {
      return null;
    }
    return closestPurchase.categoryId;
  }

  async extractCategoriesIdsForPurchaseDtos({ purchaseDtos, userId }: { purchaseDtos: PurchaseDto[]; userId: string }): Promise<PurchaseDto[]> {
    const products = await this.productService.getUserProducts(userId);
    return Promise.all(purchaseDtos.map(async dto => {
      dto.categoryId = await this.getClosestCategoryIdByProductTitle({
        title: dto.title.trim(),
        products,
      });
      return dto;
    }));
  }
}
