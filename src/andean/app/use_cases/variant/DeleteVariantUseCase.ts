import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';

@Injectable()
export class DeleteVariantUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) { }

	async execute(id: string): Promise<void> {
		const existing = await this.variantRepository.getById(id);

		if (!existing) {
			throw new NotFoundException(`Variant with id ${id} not found`);
		}

		const deleted = await this.variantRepository.delete(id);

		if (!deleted) {
			throw new NotFoundException('Failed to delete Variant');
		}
	}
}
