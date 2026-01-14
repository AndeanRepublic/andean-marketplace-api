import { SuperfoodTypeDocument } from '../persistence/superfood/superfoodType.schema';
import { SuperfoodType } from '../../domain/entities/superfoods/SuperfoodType';

export class SuperfoodTypeMapper {
	static fromDocument(doc: SuperfoodTypeDocument): SuperfoodType {
		return new SuperfoodType(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodType): any {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
