import { SuperfoodNutritionalFeatureDocument } from '../persistence/superfoodNutritionalFeature.schema';
import { SuperfoodNutritionalFeature } from '../../domain/entities/superfoods/SuperfoodNutritionalFeature';

export class SuperfoodNutritionalFeatureMapper {
	static fromDocument(doc: SuperfoodNutritionalFeatureDocument): SuperfoodNutritionalFeature {
		return new SuperfoodNutritionalFeature(
			doc.id,
			doc.name,
			doc.icon,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodNutritionalFeature): any {
		return {
			id: entity.id,
			name: entity.name,
			icon: entity.icon,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
