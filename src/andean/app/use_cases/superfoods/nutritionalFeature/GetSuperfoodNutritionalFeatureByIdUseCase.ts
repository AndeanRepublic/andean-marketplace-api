import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { SuperfoodNutritionalFeatureResponse } from '../../../modules/SuperfoodNutritionalFeatureResponse';

@Injectable()
export class GetSuperfoodNutritionalFeatureByIdUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) { }

	async handle(id: string): Promise<SuperfoodNutritionalFeatureResponse> {
		const nutritionalFeature = await this.nutritionalFeatureRepository.getById(id);

		if (!nutritionalFeature) {
			throw new NotFoundException(`SuperfoodNutritionalFeature with ID ${id} not found`);
		}

		return {
			id: nutritionalFeature.id,
			name: nutritionalFeature.name,
			icon: nutritionalFeature.icon,
			createdAt: nutritionalFeature.createdAt!,
			updatedAt: nutritionalFeature.updatedAt!,
		};
	}
}
