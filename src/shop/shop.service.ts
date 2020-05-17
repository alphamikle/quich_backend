import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '~/shop/entities/shop.entity';
import { ShopDto } from '~/shop/dto/shop.dto';
import { DadataService } from '~/dadata/dadata.service';
import { MapsService } from '~/maps/maps.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopEntityRepository: Repository<Shop>,
    private readonly dadataService: DadataService,
    private readonly mapsService: MapsService,
  ) {
  }

  async getUserShops(userId: string): Promise<Shop[]> {
    const shops: Shop[] = await this.shopEntityRepository.query(`
      SELECT distinct(se.id), se.title, se.address, se.tin, se.latitude, se.longitude FROM shop_entity se
        LEFT OUTER JOIN bill_entity be on se.id = be."shopId"
        WHERE be."userId" = '${ userId }'
    `);
    return shops;
  }

  async createShopEntity(shopDto: ShopDto): Promise<Shop> {
    const shop = new Shop();
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

  async getShopByTitle(title: string): Promise<Shop> {
    return this.shopEntityRepository.findOne({ title });
  }

  async getShopByTitleAndAddress({ title, address }: { title: string, address: string }): Promise<Shop> {
    return this.shopEntityRepository.findOne({
      title,
      address,
    });
  }

  async getShopByProps({ title, address }: { title: string, address?: string }): Promise<Shop> {
    let shop: Shop;
    if (address) {
      shop = await this.getShopByTitleAndAddress({
        title,
        address,
      });
    }
    if (!shop) {
      shop = await this.getShopByTitle(title);
    }
    return shop;
  }

  async getShopById(id: string): Promise<Shop> {
    return this.shopEntityRepository.findOne(id);
  }

  async editShop(shopDto: ShopDto): Promise<Shop> {
    const shop = await this.getShopById(shopDto.id);
    if (shopDto.title !== shop.title) {
      return this.createShopEntity(shopDto);
    }
    return shop;
  }

  async findOrCreateShop(shopDto: ShopDto): Promise<Shop> {
    let shop: Shop;
    if (shopDto.id) {
      shop = await this.getShopById(shopDto.id);
    }
    if (!shop) {
      shop = await this.getShopByProps({
        title: shopDto.title,
        address: shopDto.address,
      });
    }
    if (!shop) {
      shop = await this.createShopEntity(shopDto);
    }
    return shop;
  }
}
