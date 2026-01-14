import { Injectable, Inject } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';

@Injectable()
export class GetSuperfoodProductsByOwnerUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) { }

	async handle(ownerId: string): Promise<SuperfoodProduct[]> {
		return this.superfoodProductRepository.getAllByOwnerId(ownerId);
	}
}
