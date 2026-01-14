import { Injectable } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';

@Injectable()
export class ListSuperfoodNutritionalFeaturesUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) { }

	async handle(): Promise<SuperfoodNutritionalFeature[]> {
		return await this.nutritionalFeatureRepository.getAll();
	}
}
