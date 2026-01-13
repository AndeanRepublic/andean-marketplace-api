import { SuperfoodBenefitDocument } from '../persistence/superfoodBenefit.schema';
import { SuperfoodBenefit } from '../../domain/entities/superfoods/SuperfoodBenefit';

export class SuperfoodBenefitMapper {
	static fromDocument(doc: SuperfoodBenefitDocument): SuperfoodBenefit {
		return new SuperfoodBenefit(
			doc.id,
			doc.name,
			doc.icon,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodBenefit): any {
		return {
			id: entity.id,
			name: entity.name,
			icon: entity.icon,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
