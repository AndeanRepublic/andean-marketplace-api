import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';
import { ShopStatus } from '../../../domain/enums/ShopStatus';

@Injectable()
export class ListAllShopsUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(): Promise<Shop[]> {
		const shops = await this.shopRepository.getAll();
		return shops.filter((shop) => shop.status === ShopStatus.ACTIVE);
	}
}
