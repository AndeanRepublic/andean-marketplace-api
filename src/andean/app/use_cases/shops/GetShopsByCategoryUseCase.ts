import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { Shop } from '../../../domain/entities/Shop';
import { ShopCategory } from '../../../domain/enums/ShopCategory';

@Injectable()
export class GetShopsByCategoryUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(category: string): Promise<Shop[]> {
		const shopCategory = ShopCategory[category as keyof typeof ShopCategory];
		return this.shopRepository.getAllByCategory(shopCategory);
	}
}
