import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/shop/Shop.repo';
import { Shop } from '../../../domain/entities/shop/Shop';

@Injectable()
export class ListAllShopsUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(): Promise<Shop[]> {
		return this.shopRepository.getAll();
	}
}
