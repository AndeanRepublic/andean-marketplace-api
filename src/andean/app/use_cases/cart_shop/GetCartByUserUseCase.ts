import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { CartShop } from '../../../domain/entities/CartShop';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';

@Injectable()
export class GetCartByUserUseCase {
  constructor(
    @Inject(CartShopRepository)
    private readonly cartShopRepository: CartShopRepository,
    @Inject(CustomerProfileRepository)
    private readonly userRepository: CustomerProfileRepository,
  ) {}

  async handle(customerId: string): Promise<CartShop> {
    const customerFound = await this.userRepository.getCustomerById(customerId);
    if (!customerFound) {
      throw new NotFoundException('CustomerProfile not found');
    }
    const cartFound = await this.cartShopRepository.getCartByUser(customerId);
    if (!cartFound) {
      throw new NotFoundException('CustomerProfile cart not found');
    }
    return cartFound;
  }
}
