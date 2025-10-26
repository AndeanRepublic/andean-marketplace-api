import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { ProductRepository } from '../../datastore/Product.repo';
import { CartShop } from '../../../domain/entities/CartShop';
import { UserRepository } from '../../datastore/Customer.repo';

@Injectable()
export class RemoveItemFromCartUseCase {
  constructor(
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(customerId: string, productId: string): Promise<CartShop> {
    const customerFound = await this.userRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('Customer not found');
    }
    const productFound = await this.productRepository.getProductById(productId);
    if (!productFound) {
      throw new NotFoundException('Product not found');
    }
    return this.cartShopRepository.removeItem(customerId, productId);
  }
}
