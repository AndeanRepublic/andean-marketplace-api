import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductTraceabilityRepository } from '../../datastore/productTraceability.repo';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';

@Injectable()
export class GetProductTraceabilityByIdUseCase {
	constructor(
		private readonly traceabilityRepository: ProductTraceabilityRepository,
	) { }

	async execute(id: string): Promise<ProductTraceability> {
		const traceability = await this.traceabilityRepository.getById(id);

		if (!traceability) {
			throw new NotFoundException(`Traceability with id ${id} not found`);
		}

		return traceability;
	}
}
