import { Injectable, Inject } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';

@Injectable()
export class DeleteVariantsByProductIdUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) { }

	async execute(productId: string): Promise<boolean> {
		return await this.variantRepository.deleteByProductId(productId);
	}
}
