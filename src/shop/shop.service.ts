import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopEntity } from './entities/shop.entity';
import { ShopDto } from './dto/shop.dto';
import { DadataService } from '../dadata/dadata.service';
import { MapsService } from '../maps/maps.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private readonly shopEntityRepository: Repository<ShopEntity>,
    private readonly dadataService: DadataService,
    private readonly mapsService: MapsService,
  ) {
  }

  async getUserShops(userId: string): Promise<ShopEntity[]> {
    const shops: ShopEntity[] = await this.shopEntityRepository.query(`
      SELECT distinct(se.id), se.title, se.address, se.tin, se.latitude, se.longitude FROM shop_entity se
        LEFT OUTER JOIN bill_entity be on se.id = be."shopId"
        WHERE be."userId" = '${ userId }'
    `);
    return shops;
  }

  async createShopEntity(shopDto: ShopDto): Promise<ShopEntity> {
    const shop = new ShopEntity();
    shop.address = shopDto.address;
    shop.title = shopDto.title;
    shop.tin = shopDto.tin;
    if ((shop.title === undefined || shop.title === null || !shop.title.trim()) && shop.tin) {
      const shopData = await this.dadataService.getShopInfoByTin(shop.tin);
      shop.title = shopData.value;
      if (!shop.address) {
        shop.address = shopData.data.address.value;
      }
    }
    if (shop.address) {
      const coords = await this.mapsService.getCoordinatesByAddress(shop.address);
      if (coords !== null) {
        const { latitude, longitude } = coords;
        shop.latitude = latitude;
        shop.longitude = longitude;
      }
    }
    return this.shopEntityRepository.save(shop);
  }

  async getShopByTitle(title: string): Promise<ShopEntity> {
    return this.shopEntityRepository.findOne({ title });
  }

  async getShopByTitleAndAddress({ title, address }: { title: string, address: string }): Promise<ShopEntity> {
    return this.shopEntityRepository.findOne({ title, address });
  }

  async getShopByProps({ title, address }: { title: string, address?: string }): Promise<ShopEntity> {
    let shop: ShopEntity;
    if (address) {
      shop = await this.getShopByTitleAndAddress({ title, address });
    }
    if (!shop) {
      shop = await this.getShopByTitle(title);
    }
    return shop;
  }

  async getShopById(id: string): Promise<ShopEntity> {
    return this.shopEntityRepository.findOne(id);
  }

  async editShop(shopDto: ShopDto): Promise<ShopEntity> {
    const shop = await this.getShopById(shopDto.id);
    if (shopDto.title !== shop.title) {
      return this.createShopEntity(shopDto);
    }
    return shop;
  }

  async findOrCreateShop(shopDto: ShopDto): Promise<ShopEntity> {
    let shop: ShopEntity;
    if (shopDto.id) {
      shop = await this.getShopById(shopDto.id);
    }
    if (!shop) {
      shop = await this.getShopByProps({ title: shopDto.title, address: shopDto.address });
    }
    if (!shop) {
      shop = await this.createShopEntity(shopDto);
    }
    return shop;
  }
}
