import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { CartShop } from '../../../domain/entities/CartShop';
import { UserRepository } from '../../datastore/Customer.repo';

@Injectable()
export class CleanCartUseCase {
  constructor(
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async handle(customerId: string): Promise<CartShop> {
    const customerFound = await this.userRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('Customer not found');
    }
    return this.cartShopRepository.clearCart(customerId);
  }
}
