import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';

@Injectable()
export class DeleteShopUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(shopId: string): Promise<void> {
		return this.shopRepository.deleteShop(shopId);
	}
}
