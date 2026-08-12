import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

const MANAGED_SHOP_STATUSES = new Set<ShopStatus>([
	ShopStatus.ACTIVE,
	ShopStatus.DEACTIVATED,
]);

@Injectable()
export class ListShopsForAdminUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(): Promise<Shop[]> {
		const shops = await this.shopRepository.getAll();
		return shops.filter((shop) => MANAGED_SHOP_STATUSES.has(shop.status));
	}
}
