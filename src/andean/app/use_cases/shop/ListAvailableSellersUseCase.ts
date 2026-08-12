import { Inject, Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { SellerProfile } from '../../../domain/entities/SellerProfile';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { SellerProfileResponse } from '../../models/users/SellerProfileResponse';

@Injectable()
export class ListAvailableSellersUseCase {
	constructor(
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	async handle(search?: string): Promise<SellerProfileResponse[]> {
		const [sellers, shops] = await Promise.all([
			this.sellerRepository.getAllSellers(),
			this.shopRepository.getAll(),
		]);

		const sellerIdsWithShop = new Set(
			shops.map((shop) => shop.sellerId).filter(Boolean) as string[],
		);

		const query = search?.trim().toLowerCase() ?? '';

		const available = sellers.filter((seller) => {
			if (sellerIdsWithShop.has(seller.id)) {
				return false;
			}
			if (!query) {
				return true;
			}
			return this.matchesSearch(seller, query);
		});

		return available.map((s) => SellerProfileMapper.toResponse(s));
	}

	private matchesSearch(seller: SellerProfile, query: string): boolean {
		const haystack =
			`${seller.name} ${seller.numberDocument} ${seller.ruc ?? ''}`.toLowerCase();
		return haystack.includes(query);
	}
}
