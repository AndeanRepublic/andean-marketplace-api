import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../datastore/Product.repo';
import { Product } from '../../../domain/entities/products/Product';
import { ShopRepository } from '../../datastore/Shop.repo';

@Injectable()
export class GetProductsByShopUseCase {
  constructor(
    @Inject(ShopRepository)
    private readonly shopRepository: ShopRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(shopId: string): Promise<Product[]> {
    const shopFound = await this.shopRepository.getById(shopId);
    if (!shopFound) {
      throw new NotFoundException('Shop not found');
    }
    return this.productRepository.getAllByShopId(shopId);
  }
}
