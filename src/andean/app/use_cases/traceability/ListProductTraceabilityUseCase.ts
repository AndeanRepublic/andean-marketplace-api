import { Injectable } from '@nestjs/common';
import { ProductTraceabilityRepository } from '../../datastore/productTraceability.repo';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';
import { ProductType } from '../../../domain/enums/ProductType';

@Injectable()
export class ListProductTraceabilityUseCase {
	constructor(
		private readonly traceabilityRepository: ProductTraceabilityRepository,
	) { }

	async execute(productType?: ProductType): Promise<ProductTraceability[]> {
		if (productType) {
			return await this.traceabilityRepository.findByProductType(productType);
		}
		return await this.traceabilityRepository.findAll();
	}
}
