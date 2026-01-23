import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';

@Injectable()
export class DeleteSuperfoodProductUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
	) {}

	async handle(productId: string): Promise<void> {
		// Validar que el producto existe antes de eliminar
		const productFound =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!productFound) {
			throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
		}

		await this.superfoodProductRepository.deleteSuperfoodProduct(productId);
	}
}
