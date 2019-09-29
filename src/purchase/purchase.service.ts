import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseEntity } from './entities/purchase.entity';
import { In, Repository } from 'typeorm';
import { PurchaseDto } from './dto/purchase.dto';
import { ProductService } from '../product/product.service';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseEntityRepository: Repository<PurchaseEntity>,
    private readonly productService: ProductService,
  ) {
  }

  async getPurchaseById(id: string): Promise<PurchaseEntity> {
    return await this.purchaseEntityRepository.findOne(id);
  }

  async updateUserPurchasesCategoryId({ oldCategoryId, newCategoryId, userId }: { oldCategoryId: string, newCategoryId: string, userId: string }) {
    const purchases = await this.getUserPurchases(userId);
    const ids = purchases.map(purchase => purchase.id);
    if (ids.length) {
      await this.purchaseEntityRepository.update({ categoryId: oldCategoryId, id: In(ids) }, { categoryId: newCategoryId });
    }
  }

  async getUserPurchases(userId: string): Promise<PurchaseEntity[]> {
    const purchases: PurchaseEntity[] = await this.purchaseEntityRepository.query(`
      SELECT pe.id, pe."billId", pe."categoryId", pe."createdAt", pe.price, pe.quantity, pe.rate
      FROM purchase_entity pe
        LEFT JOIN bill_entity be on pe."billId" = be.id
        WHERE be."userId" = '${ userId }'
    `);
    return purchases;
  }

  async createPurchase({ purchaseDto, billId }: { purchaseDto: PurchaseDto, billId: string }): Promise<PurchaseEntity> {
    const product = await this.productService.findOrCreateProductByTitleOrId({ title: purchaseDto.title, id: purchaseDto.id });
    const purchase = new PurchaseEntity();
    purchase.categoryId = purchaseDto.categoryId;
    purchase.price = purchaseDto.price;
    purchase.productId = product.id;
    purchase.quantity = purchaseDto.quantity;
    purchase.rate = purchaseDto.rate;
    purchase.billId = billId;
    return await this.purchaseEntityRepository.save(purchase);
  }

  async getPurchasesByBillId(billId: string): Promise<PurchaseEntity[]> {
    return await this.purchaseEntityRepository.find({ where: { billId } });
  }

  async editPurchase({ purchaseDto, billId }: { purchaseDto: PurchaseDto, billId: string }): Promise<PurchaseEntity> {
    let purchaseEntity: PurchaseEntity;
    let product: ProductEntity;
    if (purchaseDto.id) {
      purchaseEntity = await this.getPurchaseById(purchaseDto.id);
      product = await this.productService.getProductById(purchaseEntity.productId);
      if (purchaseDto.title !== product.title) {
        product = await this.productService.findOrCreateProductByTitleOrId({ title: purchaseDto.title, id: null });
        purchaseEntity.productId = product.id;
      }
      purchaseEntity.categoryId = purchaseDto.categoryId;
      purchaseEntity.price = purchaseDto.price;
      purchaseEntity.quantity = purchaseDto.quantity;
      purchaseEntity = await this.purchaseEntityRepository.save(purchaseEntity);
    } else {
      purchaseEntity = await this.createPurchase({ purchaseDto, billId });
    }
    return purchaseEntity;
  }

  async getClosestCategoryIdByProductTitle(title: string): Promise<string | null> {
    const closestProduct = await this.productService.getClosestProductByTitle(title);
    if (!closestProduct) {
      return null;
    }
    const closestPurchase = await this.purchaseEntityRepository.findOne({ where: { productId: closestProduct.id }, order: { createdAt: 'DESC' } });
    if (!closestPurchase) {
      return null;
    }
    return closestPurchase.categoryId;
  }

  async extractCategoriesIdsForPurchaseDtos(purchaseDtos: PurchaseDto[]): Promise<PurchaseDto[]> {
    return await Promise.all(purchaseDtos.map(async dto => {
      dto.categoryId = await this.getClosestCategoryIdByProductTitle(dto.title);
      return dto;
    }));
  }
}
