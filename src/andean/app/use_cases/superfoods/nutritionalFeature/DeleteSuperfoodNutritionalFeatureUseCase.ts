import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';

@Injectable()
export class DeleteSuperfoodNutritionalFeatureUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) { }

	async handle(id: string): Promise<void> {
		const nutritionalFeature = await this.nutritionalFeatureRepository.getById(id);

		if (!nutritionalFeature) {
			throw new NotFoundException(`SuperfoodNutritionalFeature with ID ${id} not found`);
		}

		await this.nutritionalFeatureRepository.delete(id);
	}
}
