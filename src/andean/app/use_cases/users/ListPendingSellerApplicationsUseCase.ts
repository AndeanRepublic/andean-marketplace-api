import { Inject, Injectable } from '@nestjs/common';
import { SellerProfileRepository } from '../../datastore/Seller.repo';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { SellerStatus } from '../../../domain/enums/SellerStatus';
import { ShopStatus } from '../../../domain/enums/ShopStatus';
import { SellerProfileMapper } from '../../../infra/services/SellerProfileMapper';
import { SellerProfileResponse } from '../../models/users/SellerProfileResponse';
import { Shop } from '../../../domain/entities/shop/Shop';

export type PendingSellerApplicationItem = {
	seller: SellerProfileResponse;
	shops: Shop[];
};

@Injectable()
export class ListPendingSellerApplicationsUseCase {
	constructor(
		@Inject(SellerProfileRepository)
		private readonly sellerRepository: SellerProfileRepository,
		@Inject(ShopRepository)
		private readonly shopRepository: ShopRepository,
	) {}

	async handle(): Promise<PendingSellerApplicationItem[]> {
		const allSellers = await this.sellerRepository.getAllSellers();
		const pendingSellers = allSellers.filter(
			(s) => s.status === SellerStatus.PENDING,
		);

		const result: PendingSellerApplicationItem[] = [];

		for (const seller of pendingSellers) {
			const shops = await this.shopRepository.getAllBySellerId(seller.id);
			const pendingShops = shops.filter(
				(s) => s.status === ShopStatus.PENDING,
			);
			result.push({
				seller: SellerProfileMapper.toResponse(seller),
				shops: pendingShops,
			});
		}

		return result;
	}
}
