import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { UserRepository } from '../../datastore/Customer.repo';

@Injectable()
export class CleanCartUseCase {
  constructor(
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async handle(customerId: string): Promise<void> {
    const customerFound = await this.userRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('Customer not found');
    }
    await this.cartShopRepository.clearCart(customerId);
  }
}
