import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { SuperfoodProductRepository } from '../../datastore/superfoods/SuperfoodProduct.repo';
import { DetailSourceProductRepository } from '../../datastore/DetailSourceProduct.repo';

@Injectable()
export class GetSuperfoodProductByIdUseCase {
	constructor(
		@Inject(SuperfoodProductRepository)
		private readonly superfoodProductRepository: SuperfoodProductRepository,
		@Inject(DetailSourceProductRepository)
		private readonly detailSourceProductRepository: DetailSourceProductRepository,
	) {}

	async handle(productId: string): Promise<Record<string, unknown>> {
		const productFound =
			await this.superfoodProductRepository.getSuperfoodProductById(productId);

		if (!productFound) {
			throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
		}

		const payload = instanceToPlain(productFound) as Record<string, unknown>;

		if (productFound.detailSourceProductId) {
			const source = await this.detailSourceProductRepository.getById(
				productFound.detailSourceProductId,
			);
			if (source) {
				payload.detailSourceProduct = {
					name: source.name,
					description: source.description,
					features: source.features ?? [],
				};
			}
		}

		return payload;
	}
}
