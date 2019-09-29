import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { getWordsDistance } from '../helpers/common.helper';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(title: string): Promise<ProductEntity> {
    const product = new ProductEntity();
    product.title = title;
    return await this.productEntityRepository.save(product);
  }

  async getProductByTitle(title: string): Promise<ProductEntity> {
    return await this.productEntityRepository.findOne({ where: { title } });
  }

  async getProductById(id: string): Promise<ProductEntity> {
    return await this.productEntityRepository.findOne({ where: { id } });
  }

  async createProductEntity(title: string): Promise<ProductEntity> {
    const product = new ProductEntity();
    product.title = title;
    return await this.productEntityRepository.save(product);
  }

  async getAllProducts(): Promise<ProductEntity[]> {
    return await this.productEntityRepository.find({ order: { title: 'ASC' } });
  }

  async getClosestProductByTitle(title: string): Promise<ProductEntity | null> {
    let min = Infinity;
    let target: ProductEntity = null;
    const products = await this.getAllProducts();
    for (let i = 0, l = products.length; i < l; i++) {
      const product = products[i];
      const distance = getWordsDistance(title, product.title);
      if (min > distance && distance < (title.length + product.title.length) / 3) {
        min = distance;
        target = product;
        if (min === 0) {
          return target;
        }
      }
    }
    return target;
  }

  async findOrCreateProductByTitleOrId({ title, id }: { title: string, id: string }): Promise<ProductEntity> {
    let product: ProductEntity;
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
