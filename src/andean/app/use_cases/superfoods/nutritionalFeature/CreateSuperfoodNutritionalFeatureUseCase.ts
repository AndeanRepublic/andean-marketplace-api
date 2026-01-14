import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { CreateSuperfoodNutritionalFeatureDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodNutritionalFeatureDto';
import { SuperfoodNutritionalFeatureResponse } from '../../../modules/SuperfoodNutritionalFeatureResponse';

@Injectable()
export class CreateSuperfoodNutritionalFeatureUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) { }

	async handle(dto: CreateSuperfoodNutritionalFeatureDto): Promise<SuperfoodNutritionalFeatureResponse> {
		const nutritionalFeature = new SuperfoodNutritionalFeature(
			crypto.randomUUID(),
			dto.name,
			dto.icon,
			new Date(),
			new Date(),
		);

		const savedFeature = await this.nutritionalFeatureRepository.save(nutritionalFeature);
		return {
			id: savedFeature.id,
			name: savedFeature.name,
			icon: savedFeature.icon,
			createdAt: savedFeature.createdAt!,
			updatedAt: savedFeature.updatedAt!,
		};
	}
}
