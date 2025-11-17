import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { CreateShopDto } from '../../../infra/controllers/dto/CreateShopDto';
import { Shop } from '../../../domain/entities/Shop';
import { SellerProfileRepository } from '../../datastore/Seller.repo';

@Injectable()
export class CreateShopUseCase {
  constructor(
    @Inject(ShopRepository)
    private shopRepository: ShopRepository,
    @Inject(SellerProfileRepository)
    private sellerRepository: SellerProfileRepository,
  ) {}

  async handle(shopDto: CreateShopDto): Promise<Shop> {
    const sellerFound = await this.sellerRepository.getSellerById(
      shopDto.sellerId,
    );
    if (!sellerFound) {
      throw new NotFoundException();
    }
    const shopToSave = new Shop(
      crypto.randomUUID(),
      shopDto.sellerId,
      shopDto.name,
      shopDto.description,
      shopDto.categories,
      shopDto.policies,
      shopDto.shippingOrigin,
      shopDto.shippingArea,
    );
    return this.shopRepository.saveShop(shopToSave);
  }
}