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

	async handle(customerId?: string, customerEmail?: string): Promise<void> {
		// Validar que al menos uno de los identificadores esté presente
		if (!customerId && !customerEmail) {
			throw new NotFoundException('Either customerId or customerEmail must be provided');
		}

		// Si hay customerId, validar que el customer existe
		if (customerId) {
			const customerFound =
				await this.customerRepository.getCustomerById(customerId);
			if (!customerFound) {
				throw new NotFoundException('CustomerProfile not found');
			}
		}

		const cartFound =
			await this.cartShopRepository.getCartByIdentifier(customerId, customerEmail);
		if (cartFound) {
			await this.cartItemRepository.deleteItemsByCartShopId(cartFound.id);
		}
	}
}
