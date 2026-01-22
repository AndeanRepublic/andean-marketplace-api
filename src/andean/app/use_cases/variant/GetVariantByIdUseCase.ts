import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Variant } from '../../../domain/entities/Variant';

@Injectable()
export class GetVariantByIdUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) { }

	async execute(id: string): Promise<Variant> {
		const variant = await this.variantRepository.getById(id);

		if (!variant) {
			throw new NotFoundException(`Variant with id ${id} not found`);
		}

		return variant;
	}
}
