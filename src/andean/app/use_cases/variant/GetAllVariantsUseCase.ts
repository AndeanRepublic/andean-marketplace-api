import { Injectable, Inject } from '@nestjs/common';
import { VariantRepository } from '../../datastore/Variant.repo';
import { Variant } from '../../../domain/entities/Variant';

@Injectable()
export class GetAllVariantsUseCase {
	constructor(
		@Inject(VariantRepository)
		private readonly variantRepository: VariantRepository,
	) { }

	async execute(): Promise<Variant[]> {
		return await this.variantRepository.getAll();
	}
}
