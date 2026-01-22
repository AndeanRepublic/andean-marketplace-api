import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';

@Injectable()
export class CleanCartUseCase {
  constructor(
    @Inject(CartShopItemRepository)
    private readonly cartItemRepository: CartShopItemRepository,
    @Inject(CustomerProfileRepository)
    private readonly customerRepository: CustomerProfileRepository,
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
  ) {}

  async handle(customerId: string): Promise<void> {
    const customerFound = await this.customerRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    const cartFound = await this.cartShopRepository.getCartByCustomerId(customerId);
    if (cartFound) {
      await this.cartItemRepository.deleteItemsByCartShopId(cartFound.id);
    }
  }
}
