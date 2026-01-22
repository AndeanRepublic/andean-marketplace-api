import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';

@Injectable()
export class RemoveItemFromCartUseCase {
  constructor(
    @Inject(CustomerProfileRepository)
    private readonly customerRepository: CustomerProfileRepository,
    @Inject(CartShopItemRepository)
    private readonly cartItemRepository: CartShopItemRepository,
  ) {}

  async handle(customerId: string, itemId: string): Promise<void> {
    const customerFound = await this.customerRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    await this.cartItemRepository.deleteItem(itemId);
  }
}
