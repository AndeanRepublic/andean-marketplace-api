import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { CartShop } from '../../../domain/entities/CartShop';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { Types } from 'mongoose';

@Injectable()
export class GetCartByCustomerUseCase {
	constructor(
		@Inject(CartShopRepository)
		private readonly cartShopRepository: CartShopRepository,
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
	) {}

	async handle(customerId: string): Promise<CartShop> {
		const customerFound =
			await this.customerRepository.getCustomerById(customerId);
		if (!customerFound) {
			throw new NotFoundException('CustomerProfile not found');
		}
		let cartFound =
			await this.cartShopRepository.getCartByCustomerId(customerId);
		if (!cartFound) {
			cartFound = new CartShop(
				new Types.ObjectId().toString(),
				customerId,
				0,
				0,
				0,
				new Date(),
				new Date(),
			);
			await this.cartShopRepository.createCart(cartFound);
		}
		return cartFound;
	}
}
