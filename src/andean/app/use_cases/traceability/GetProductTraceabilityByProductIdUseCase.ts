import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductTraceabilityRepository } from '../../datastore/productTraceability.repo';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';

@Injectable()
export class GetProductTraceabilityByProductIdUseCase {
	constructor(
		private readonly traceabilityRepository: ProductTraceabilityRepository,
	) { }

	async execute(productId: string): Promise<ProductTraceability> {
		const traceability = await this.traceabilityRepository.findByProductId(productId);

		if (!traceability) {
			throw new NotFoundException(`Traceability for product ${productId} not found`);
		}

		return traceability;
	}
}
