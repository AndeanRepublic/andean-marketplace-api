import { SuperfoodProductPresentationDocument } from '../../persistence/superfood/superfoodProductPresentation.schema';
import { SuperfoodProductPresentation } from '../../../domain/entities/superfoods/SuperfoodProductPresentation';

export class SuperfoodProductPresentationMapper {
	static fromDocument(doc: SuperfoodProductPresentationDocument): SuperfoodProductPresentation {
		return new SuperfoodProductPresentation(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodProductPresentation): any {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
