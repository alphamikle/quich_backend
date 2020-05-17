import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '~/product/entities/product.entity';
import { getWordsDistance } from '~/helpers/common.helper';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productEntityRepository: Repository<Product>,
  ) {
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    const products: Product[] = await this.productEntityRepository.query(`
        SELECT * FROM product_entity pe WHERE pe.id IN (
            SELECT pue."productId" FROM purchase_entity pue
            LEFT JOIN bill_entity be on pue."billId" = be.id
            WHERE be."userId" = '${ userId }'
        )
    `);
    return products;
  }

  async createProduct(title: string): Promise<Product> {
    const product = new Product();
    product.title = title;
    return this.productEntityRepository.save(product);
  }

  async getProductByTitle(title: string): Promise<Product> {
    return this.productEntityRepository.findOne({ where: { title } });
  }

  async getProductById(id: string): Promise<Product> {
    return this.productEntityRepository.findOne({ where: { id } });
  }

  async createProductEntity(title: string): Promise<Product> {
    const product = new Product();
    product.title = title;
    return this.productEntityRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productEntityRepository.find({ order: { title: 'ASC' } });
  }

  async getClosestProductByTitle({ title, products }: { title: string, products: Product[] }): Promise<Product | null> {
    const separator = /( )|(\.)/g;
    let min = Infinity;
    let target: Product = null;
    title = title.toLowerCase();
    const subTitles = title.split(separator)
      .filter(t => t)
      .map(t => t.trim())
      .filter(t => t.length > 2);
    const subTitlesLength = subTitles.length;
    for (let i = 0, l = products.length; i < l; i++) {
      let isLess = false;
      const product = products[i];
      const productTitle = product.title.toLowerCase();
      const distance = getWordsDistance(title, productTitle);
      // ? Дистанция должна быть больше 1|5 от суммы длин строк названий
      const partOfWordsLength = (title.length + productTitle.length) / 5;
      if (min > distance && distance < partOfWordsLength) {
        isLess = true;
        min = distance;
        target = product;
        if (min === 0) {
          return target;
        }
      }
      const smallestTitleLength = Math.min(title.length, productTitle.length);
      // ? По словам пробегаемся если не нашли совпадений в предыдущем поиске и если дистанция не длиннее кратчайшего слова
      if (!isLess && distance < smallestTitleLength) {
        let subCount = 0;
        let hasEqualityWords = false;
        const productSubTitles = productTitle.split(separator)
          .filter(t => t)
          .map(t => t.trim())
          .filter(t => t.length > 2);
        const productSubTitlesLength = productSubTitles.length;
        for (let k = 0; k < subTitlesLength; k++) {
          const subTitle = subTitles[k];
          for (let x = 0; x < productSubTitlesLength; x++) {
            const productSubTitle = productSubTitles[x];
            const subDistance = getWordsDistance(subTitle, productSubTitle);
            if (subDistance === 0) {
              hasEqualityWords = true;
              break;
            }
            const smallestSubWordLength = Math.min(subTitle.length, productSubTitle.length);
            if (subDistance <= 2 && subDistance < smallestSubWordLength) {
              subCount++;
            }
          }
        }
        // ? Количество похожих слов должно быть 2 или по одному одинаковому и хотя бы одному похожему
        if (subCount > 2 || (hasEqualityWords && subCount)) {
          target = product;
        }
      }
    }
    return target;
  }

  async findOrCreateProductByTitleOrId({ title, id }: { title: string, id: string }): Promise<Product> {
    let product: Product;
    if (id) {
      product = await this.getProductById(id);
      if (product && product.title !== title) {
        product = null;
      }
    }
    if (!product) {
      product = await this.getProductByTitle(title);
    }
    if (!product) {
      product = await this.createProduct(title);
    }
    return product;
  }
}
