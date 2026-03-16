import { Injectable } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { CreateManySuperfoodNutritionalFeaturesDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodNutritionalFeaturesDto';
import { SuperfoodNutritionalFeatureResponse } from '../../../modules/superfoods/SuperfoodNutritionalFeatureResponse';
import { SuperfoodNutritionalFeatureMapper } from '../../../../infra/services/superfood/SuperfoodNutritionalFeatureMapper';

@Injectable()
export class CreateManySuperfoodNutritionalFeaturesUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) {}

	async handle(
		dto: CreateManySuperfoodNutritionalFeaturesDto,
	): Promise<SuperfoodNutritionalFeatureResponse[]> {
		const featuresToSave = dto.superfoodNutritionalFeatures.map((itemDto) =>
			SuperfoodNutritionalFeatureMapper.fromCreateDto(itemDto),
		);
		const savedFeatures =
			await this.nutritionalFeatureRepository.saveMany(featuresToSave);
		return savedFeatures.map((feature) =>
			SuperfoodNutritionalFeatureMapper.toResponse(feature),
		);
	}
}
