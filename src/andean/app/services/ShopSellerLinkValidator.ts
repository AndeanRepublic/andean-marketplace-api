import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ShopRepository } from '../datastore/shop/Shop.repo';
import { Shop } from '../../domain/entities/shop/Shop';

@Injectable()
export class ShopSellerLinkValidator {
	constructor(
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	async assertSellerHasNoShop(sellerId: string): Promise<void> {
		const shops = await this.shopRepository.getAllBySellerId(sellerId);
		if (shops.length > 0) {
			throw new ConflictException(
				'El vendedor ya tiene una tienda asociada',
			);
		}
	}

	assertShopUnlinked(shop: Shop): void {
		if (shop.sellerId) {
			throw new ConflictException(
				'La tienda ya está enlazada a un vendedor',
			);
		}
	}
}
