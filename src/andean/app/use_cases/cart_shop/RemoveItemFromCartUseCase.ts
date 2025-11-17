import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { ProductRepository } from '../../datastore/Product.repo';
import { CartShop } from '../../../domain/entities/CartShop';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';

@Injectable()
export class RemoveItemFromCartUseCase {
  constructor(
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
    @Inject(CustomerProfileRepository)
    private readonly userRepository: CustomerProfileRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async handle(customerId: string, productId: string): Promise<CartShop> {
    const customerFound = await this.userRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    const productFound = await this.productRepository.getProductById(productId);
    if (!productFound) {
      throw new NotFoundException('Product not found');
    }
    const customerCart = await this.cartShopRepository.removeItem(
      customerId,
      productId,
    );
    if (!customerCart) {
      throw new NotFoundException('CustomerProfile cart not found');
    }
    return customerCart;
  }
}
