import { Injectable } from '@nestjs/common';
import { ShopRepository } from '../../datastore/Shop.repo';
import { Shop } from '../../../domain/entities/Shop';

@Injectable()
export class ListAllShopsUseCase {
	constructor(private readonly shopRepository: ShopRepository) {}

	async handle(): Promise<Shop[]> {
		return this.shopRepository.getAll();
	}
}
