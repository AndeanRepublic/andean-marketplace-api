import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ShopCategory } from '../../../domain/enums/ShopCategory';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

@Injectable()
export class GetShopsByCategoryUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(category: string): Promise<Shop[]> {
		const shopCategory = ShopCategory[category as keyof typeof ShopCategory];
		const shops = await this.shopRepository.getAllByCategory(shopCategory);
		return shops.filter((shop) => shop.status === ShopStatus.ACTIVE);
	}
}
