import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../datastore/Customer.repo';
import { ProductRepository } from '../../datastore/Product.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { AddCartItemDto } from '../../../infra/controllers/dto/AddCartItemDto';
import { CartShop } from '../../../domain/entities/CartShop';

@Injectable()
export class AddItemToCartUseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(ProductRepository)
    private readonly productRepository: ProductRepository,
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
  ) {}

  async handle(customerId: string, itemDto: AddCartItemDto): Promise<CartShop> {
    const customerFound = await this.userRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('Customer not found');
    }
    const productFound = await this.productRepository.getProductById(
      itemDto.productId,
    );
    if (!productFound) {
      throw new NotFoundException('Product not found');
    }
    return this.cartShopRepository.addItem(
      customerId,
      itemDto.productId,
      itemDto.quantity,
    );
  }
}
