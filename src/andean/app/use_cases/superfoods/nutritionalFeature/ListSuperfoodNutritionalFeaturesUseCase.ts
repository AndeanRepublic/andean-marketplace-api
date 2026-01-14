import { Injectable } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { SuperfoodNutritionalFeatureResponse } from '../../../modules/SuperfoodNutritionalFeatureResponse';

@Injectable()
export class ListSuperfoodNutritionalFeaturesUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) { }

	async handle(): Promise<SuperfoodNutritionalFeatureResponse[]> {
		const features = await this.nutritionalFeatureRepository.getAll();
		return features.map(feature => ({
			id: feature.id,
			name: feature.name,
			icon: feature.icon,
			createdAt: feature.createdAt!,
			updatedAt: feature.updatedAt!,
		}));
	}
}
