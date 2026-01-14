import { SuperfoodCertificationDocument } from '../../persistence/superfood/superfoodCertification.schema';
import { SuperfoodCertification } from '../../../domain/entities/superfoods/SuperfoodCertification';

export class SuperfoodCertificationMapper {
	static fromDocument(doc: SuperfoodCertificationDocument): SuperfoodCertification {
		return new SuperfoodCertification(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodCertification): any {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
