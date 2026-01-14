import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SuperfoodNutritionalFeatureRepository } from '../../../datastore/superfoods/SuperfoodNutritionalFeature.repo';
import { SuperfoodNutritionalFeature } from '../../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { CreateSuperfoodNutritionalFeatureDto } from '../../../../infra/controllers/dto/superfoods/CreateSuperfoodNutritionalFeatureDto';

@Injectable()
export class CreateSuperfoodNutritionalFeatureUseCase {
	constructor(
		private readonly nutritionalFeatureRepository: SuperfoodNutritionalFeatureRepository,
	) { }

	async handle(dto: CreateSuperfoodNutritionalFeatureDto): Promise<SuperfoodNutritionalFeature> {
		const nutritionalFeature = new SuperfoodNutritionalFeature(
			crypto.randomUUID(),
			dto.name,
			dto.icon,
			new Date(),
			new Date(),
		);

		return await this.nutritionalFeatureRepository.save(nutritionalFeature);
	}
}
