import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';

@Injectable()
export class GetShopsBySellerIdUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(sellerId: string): Promise<Shop[]> {
		return this.shopRepository.getAllBySellerId(sellerId);
	}
}
