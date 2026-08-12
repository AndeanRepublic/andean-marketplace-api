import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';

@Injectable()
export class ListAvailableShopsUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(search?: string): Promise<Shop[]> {
		const shops = await this.shopRepository.getAll();
		const query = search?.trim().toLowerCase() ?? '';

		return shops.filter((shop) => {
			if (shop.sellerId) {
				return false;
			}
			if (!query) {
				return true;
			}
			return shop.name.toLowerCase().includes(query);
		});
	}
}
