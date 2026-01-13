import { SuperfoodSalesUnitSizeDocument } from '../persistence/superfoodSalesUnitSize.schema';
import { SuperfoodSalesUnitSize } from '../../domain/entities/superfoods/SuperfoodSalesUnitSize';

export class SuperfoodSalesUnitSizeMapper {
	static fromDocument(doc: SuperfoodSalesUnitSizeDocument): SuperfoodSalesUnitSize {
		return new SuperfoodSalesUnitSize(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodSalesUnitSize): any {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
