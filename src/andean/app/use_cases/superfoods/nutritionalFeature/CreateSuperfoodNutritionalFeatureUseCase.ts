import { Injectable, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { CreateSuperfoodNutritionalFeatureDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodNutritionalFeatureDto';
import { SuperfoodNutritionalFeatureResponse } from '../../../modules/SuperfoodNutritionalFeatureResponse';
import { MediaItemRepository } from '../../../datastore/MediaItem.repo';

@Injectable()
export class CreateSuperfoodNutritionalFeatureUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
		private readonly mediaItemRepository: MediaItemRepository,
	) { }

	async handle(dto: CreateSuperfoodNutritionalFeatureDto): Promise<SuperfoodNutritionalFeatureResponse> {
		// Validar que el iconId existe si se proporciona
		if (dto.iconId) {
			const iconExists = await this.mediaItemRepository.getById(dto.iconId);
			if (!iconExists) {
				throw new BadRequestException(`MediaItem with id ${dto.iconId} not found`);
			}
		}

		const nutritionalFeature = new SuperfoodNutritionalFeature(
			crypto.randomUUID(),
			dto.name,
			dto.iconId,
			new Date(),
			new Date(),
		);

		const savedFeature = await this.nutritionalFeatureRepository.save(nutritionalFeature);
		return {
			id: savedFeature.id,
			name: savedFeature.name,
			iconId: savedFeature.iconId,
			createdAt: savedFeature.createdAt!,
			updatedAt: savedFeature.updatedAt!,
		};
	}
}
