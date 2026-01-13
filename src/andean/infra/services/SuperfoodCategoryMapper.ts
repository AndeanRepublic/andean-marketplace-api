import { SuperfoodCategoryDocument } from '../persistence/superfoodCategory.schema';
import { SuperfoodCategory } from '../../domain/entities/superfoods/SuperfoodCategory';

export class SuperfoodCategoryMapper {
	static fromDocument(doc: SuperfoodCategoryDocument): SuperfoodCategory {
		return new SuperfoodCategory(
			doc.id,
			doc.name,
			doc.status,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodCategory): any {
		return {
			id: entity.id,
			name: entity.name,
			status: entity.status,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
