import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductTraceabilityRepository } from '../../datastore/productTraceability.repo';

@Injectable()
export class DeleteProductTraceabilityUseCase {
	constructor(
		private readonly traceabilityRepository: ProductTraceabilityRepository,
	) {}

	async execute(id: string): Promise<void> {
		const existing = await this.traceabilityRepository.getById(id);

		if (!existing) {
			throw new NotFoundException(`Traceability with id ${id} not found`);
		}

		const deleted = await this.traceabilityRepository.delete(id);

		if (!deleted) {
			throw new NotFoundException('Failed to delete Traceability');
		}
	}
}
