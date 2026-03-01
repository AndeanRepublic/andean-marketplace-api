import { Injectable, BadRequestException } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { CreateSuperfoodNutritionalFeatureDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodNutritionalFeatureDto';
import { SuperfoodNutritionalFeatureResponse } from '../../../modules/SuperfoodNutritionalFeatureResponse';
import { MediaItemRepository } from '../../../datastore/MediaItem.repo';
import { SuperfoodNutritionalFeatureMapper } from '../../../../infra/services/superfood/SuperfoodNutritionalFeatureMapper';

@Injectable()
export class CreateSuperfoodNutritionalFeatureUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
		private readonly mediaItemRepository: MediaItemRepository,
	) {}

	async handle(
		dto: CreateSuperfoodNutritionalFeatureDto,
	): Promise<SuperfoodNutritionalFeatureResponse> {
		// Validar que el iconId existe si se proporciona
		if (dto.iconId) {
			const iconExists = await this.mediaItemRepository.getById(dto.iconId);
			if (!iconExists) {
				throw new BadRequestException(
					`MediaItem with id ${dto.iconId} not found`,
				);
			}
		}

		// Crear entidad usando mapper
		const nutritionalFeature =
			SuperfoodNutritionalFeatureMapper.fromCreateDto(dto);

		const savedFeature =
			await this.nutritionalFeatureRepository.save(nutritionalFeature);
		return SuperfoodNutritionalFeatureMapper.toResponse(savedFeature);
	}
}
