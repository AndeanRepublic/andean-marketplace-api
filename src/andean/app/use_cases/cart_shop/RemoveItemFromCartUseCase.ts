import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';

@Injectable()
export class RemoveItemFromCartUseCase {
  constructor(
    @Inject(CustomerProfileRepository)
    private readonly userRepository: CustomerProfileRepository,
    @Inject(CartShopItemRepository)
    private readonly cartItemRepository: CartShopItemRepository,
  ) {}

  async handle(userId: string, itemId: string): Promise<void> {
    const customerFound = await this.userRepository.getCustomerById(userId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    await this.cartItemRepository.deleteItem(itemId);
  }
}
