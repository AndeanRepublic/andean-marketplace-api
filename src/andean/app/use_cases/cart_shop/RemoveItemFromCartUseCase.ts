import {
	Inject,
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { CustomerProfileRepository } from '../../datastore/Customer.repo';
import { CartShopItemRepository } from '../../datastore/CartShopItem.repo';
import { CartShopRepository } from '../../datastore/CartShop.repo';
import { AccountRole } from '../../../domain/enums/AccountRole';

@Injectable()
export class RemoveItemFromCartUseCase {
	constructor(
		@Inject(CustomerProfileRepository)
		private readonly customerRepository: CustomerProfileRepository,
		@Inject(CartShopItemRepository)
		private readonly cartItemRepository: CartShopItemRepository,
		@Inject(CartShopRepository)
		private readonly cartShopRepository: CartShopRepository,
	) {}

	async handle(
		itemId: string,
		requestingUserId: string,
		roles: AccountRole[],
	): Promise<void> {
		const isAdmin = roles.includes(AccountRole.ADMIN);
		if (!isAdmin) {
			// Step 1: resolve caller's customer profile
			const customer =
				await this.customerRepository.getCustomerByUserId(requestingUserId);
			if (!customer) {
				throw new ForbiddenException('You can only access your own cart');
			}
			// Step 2: resolve cart item (404 before ownership check)
			const cartItem = await this.cartItemRepository.getById(itemId);
			if (!cartItem) {
				throw new NotFoundException('CartItem not found');
			}
			// Step 3: resolve parent cart
			const cartShop = await this.cartShopRepository.getCartById(
				cartItem.cartShopId,
			);
			if (!cartShop) {
				throw new NotFoundException('CartShop not found');
			}
			// Step 4: compare ownership
			if (cartShop.customerId !== customer.id) {
				throw new ForbiddenException('You can only access your own cart');
			}
		}
		// ADMIN: skip ownership chain, fall through
		await this.cartItemRepository.deleteItem(itemId);
	}
}
