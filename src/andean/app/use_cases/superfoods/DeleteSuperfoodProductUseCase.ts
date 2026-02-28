import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { DeleteDetailSourceProductUseCase } from '../detailSourceProduct/DeleteDetailSourceProductUseCase';

@Injectable()
export class DeleteSuperfoodProductUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,

		private readonly deleteDetailSourceProductUseCase: DeleteDetailSourceProductUseCase,
	) {}

	async handle(productId: string): Promise<void> {
		// 1. Validar que el producto existe antes de eliminar
		const productFound =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);
		if (!productFound) {
			throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
		}

		// 2. Si tiene detailSourceProductId, eliminarlo también
		if (productFound.detailSourceProductId) {
			try {
				await this.deleteDetailSourceProductUseCase.handle(
					productFound.detailSourceProductId,
				);
			} catch {
				// Si el DetailSourceProduct no existe, continuar con la eliminación del superfood
				console.warn(
					`DetailSourceProduct ${productFound.detailSourceProductId} not found, continuing with superfood deletion`,
				);
			}
		}

		// 3. Eliminar el superfood
		await this.superfoodProductRepository.deleteSuperfoodProduct(productId);
	}
}
