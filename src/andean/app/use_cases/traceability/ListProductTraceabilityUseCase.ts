import { Injectable } from '@nestjs/common';
import { ProductTraceabilityRepository } from '../../datastore/productTraceability.repo';
import { ProductTraceability } from '../../../domain/entities/ProductTraceability';

@Injectable()
export class ListProductTraceabilityUseCase {
	constructor(
		private readonly traceabilityRepository: ProductTraceabilityRepository,
	) {}

	async execute(): Promise<ProductTraceability[]> {
		return await this.traceabilityRepository.findAll();
	}
}
