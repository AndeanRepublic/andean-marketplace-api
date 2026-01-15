import { SuperfoodNutritionalFeatureDocument } from '../../persistence/superfood/superfoodNutritionalFeature.schema';
import { SuperfoodNutritionalFeature } from '../../../domain/entities/superfoods/SuperfoodNutritionalFeature';

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
