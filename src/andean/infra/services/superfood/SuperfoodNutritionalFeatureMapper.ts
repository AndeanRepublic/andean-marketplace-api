import { SuperfoodNutritionalFeatureDocument } from '../../persistence/superfood/superfoodNutritionalFeature.schema';
import { SuperfoodNutritionalFeature } from '../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { CreateSuperfoodNutritionalFeatureDto } from '../../controllers/dto/superfoods/CreateSuperfoodNutritionalFeatureDto';
import { SuperfoodNutritionalFeatureResponse } from '../../../app/modules/SuperfoodNutritionalFeatureResponse';
import * as crypto from 'crypto';

export class SuperfoodNutritionalFeatureMapper {
	static fromDocument(doc: SuperfoodNutritionalFeatureDocument): SuperfoodNutritionalFeature {
		return new SuperfoodNutritionalFeature(
			doc.id,
			doc.name,
			doc.iconId,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodNutritionalFeatureDto): SuperfoodNutritionalFeature {
		return new SuperfoodNutritionalFeature(
			crypto.randomUUID(),
			dto.name,
			dto.iconId,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodNutritionalFeature): SuperfoodNutritionalFeatureResponse {
		return {
			id: entity.id,
			name: entity.name,
			iconId: entity.iconId,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
	}

	static toPersistence(entity: SuperfoodNutritionalFeature): any {
		return {
			id: entity.id,
			name: entity.name,
			iconId: entity.iconId,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
