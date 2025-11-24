import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';

@Injectable()
export class CleanCartUseCase {
  constructor(
    @Inject(CartShopItemRepository)
    private readonly cartItemRepository: CartShopItemRepository,
    @Inject(CustomerProfileRepository)
    private readonly userRepository: CustomerProfileRepository,
  ) {}

  async handle(userId: string): Promise<void> {
    const customerFound = await this.userRepository.getCustomerById(userId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    await this.cartItemRepository.deleteItemsByUserId(userId);
  }
}
