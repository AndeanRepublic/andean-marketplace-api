import { Injectable, Inject } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Variant } from '../../../domain/entities/Variant';

@Injectable()
export class GetVariantsByProductIdUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) { }

	async execute(productId: string): Promise<Variant[]> {
		return await this.variantRepository.getByProductId(productId);
	}
}
