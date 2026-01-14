import { SuperfoodPreservationMethodDocument } from '../persistence/superfood/superfoodPreservationMethod.schema';
import { SuperfoodPreservationMethod } from '../../domain/entities/superfoods/SuperfoodPreservationMethod';

export class SuperfoodPreservationMethodMapper {
	static fromDocument(doc: SuperfoodPreservationMethodDocument): SuperfoodPreservationMethod {
		return new SuperfoodPreservationMethod(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodPreservationMethod): any {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
