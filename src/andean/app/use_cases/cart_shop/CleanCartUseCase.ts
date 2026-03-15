import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { AccountRole } from '../../../domain/enums/AccountRole';
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

	async handle(
		requestingUserId: string,
		roles: AccountRole[],
		targetCustomerId?: string,
	): Promise<void> {
		// Pattern H — 2-hop ownership check with ADMIN bypass
		let customerId: string | null;
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (isAdmin && targetCustomerId) {
			// ADMIN targeting a specific customer's cart
			customerId = targetCustomerId;
		} else if (!isAdmin) {
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			if (!customer) {
				throw new ForbiddenException('You can only access your own cart');
			}
			customerId = customer.id;
		} else {
			// ADMIN with no targetCustomerId: resolve own customer profile
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			customerId = customer?.id ?? null;
		}

		if (!customerId) {
			return;
		}

		const cartFound =
			await this.cartShopRepository.getCartByCustomerId(customerId);
		if (cartFound) {
			await this.cartItemRepository.deleteItemsByCartShopId(cartFound.id);
		}
	}
}
