import { Injectable } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { SuperfoodNutritionalFeatureResponse } from '../../../models/superfoods/SuperfoodNutritionalFeatureResponse';
import { SuperfoodNutritionalFeatureMapper } from '../../../../infra/services/superfood/SuperfoodNutritionalFeatureMapper';

@Injectable()
export class ListSuperfoodNutritionalFeaturesUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) {}

	async handle(): Promise<SuperfoodNutritionalFeatureResponse[]> {
		const features = await this.nutritionalFeatureRepository.getAll();
		return features.map((feature) =>
			SuperfoodNutritionalFeatureMapper.toResponse(feature),
		);
	}
}
