import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { Shop } from '../../../domain/entities/Shop';

@Injectable()
export class GetShopByIdUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(shopId: string): Promise<Shop> {
		const shopFound = await this.shopRepository.getById(shopId);
		if (!shopFound) {
			throw new NotFoundException('Shop not found');
		}
		return shopFound;
	}
}
