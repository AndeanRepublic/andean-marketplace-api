import { Injectable, NotFoundException } from '@nestjs/common';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { CreateSuperfoodNutritionalFeatureDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodNutritionalFeatureDto';
import { SuperfoodNutritionalFeatureResponse } from '../../../models/superfoods/SuperfoodNutritionalFeatureResponse';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { SuperfoodNutritionalFeatureMapper } from '../../../../infra/services/superfood/SuperfoodNutritionalFeatureMapper';

@Injectable()
export class UpdateSuperfoodNutritionalFeatureUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) {}

	async handle(
		id: string,
		dto: CreateSuperfoodNutritionalFeatureDto,
	): Promise<SuperfoodNutritionalFeatureResponse> {
		const existing = await this.nutritionalFeatureRepository.getById(id);
		if (!existing) {
			throw new NotFoundException(
				`SuperfoodNutritionalFeature with ID ${id} not found`,
			);
		}

		const updated = new SuperfoodNutritionalFeature(
			existing.id,
			dto.name,
			dto.iconId,
			existing.createdAt,
			new Date(),
		);
		const saved = await this.nutritionalFeatureRepository.update(updated);
		return SuperfoodNutritionalFeatureMapper.toResponse(saved);
	}
}
