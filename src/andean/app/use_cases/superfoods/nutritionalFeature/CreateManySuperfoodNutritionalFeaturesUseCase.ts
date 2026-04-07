import { Injectable, BadRequestException } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { MediaItemRepository } from '../../../datastore/MediaItem.repo';
import { CreateManySuperfoodNutritionalFeaturesDto } from '../../../../infra/controllers/dto/superfoods/CreateManySuperfoodNutritionalFeaturesDto';
import { SuperfoodNutritionalFeatureResponse } from '../../../models/superfoods/SuperfoodNutritionalFeatureResponse';
import { SuperfoodNutritionalFeatureMapper } from '../../../../infra/services/superfood/SuperfoodNutritionalFeatureMapper';

@Injectable()
export class CreateManySuperfoodNutritionalFeaturesUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async handle(
		dto: CreateManySuperfoodNutritionalFeaturesDto,
	): Promise<SuperfoodNutritionalFeatureResponse[]> {
		for (const item of dto.superfoodNutritionalFeatures) {
			const iconExists = await this.mediaItemRepository.getById(item.iconId);
			if (!iconExists) {
				throw new BadRequestException(
					`MediaItem with id ${item.iconId} not found`,
				);
			}
		}

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
