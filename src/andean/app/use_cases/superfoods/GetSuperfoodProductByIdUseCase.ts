import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { SuperfoodProduct } from '../../../domain/entities/superfoods/SuperfoodProduct';

@Injectable()
export class GetSuperfoodProductByIdUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) { }

	async handle(productId: string): Promise<SuperfoodProduct> {
		const productFound = await this.superfoodProductRepository.getSuperfoodProductById(productId);

		if (!productFound) {
			throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
		}

		return productFound;
	}
}
