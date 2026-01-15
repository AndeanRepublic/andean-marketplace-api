import { SuperfoodBenefitDocument } from '../../persistence/superfood/superfoodBenefit.schema';
import { SuperfoodBenefit } from '../../../domain/entities/superfoods/SuperfoodBenefit';

export class SuperfoodBenefitMapper {
	static fromDocument(doc: SuperfoodBenefitDocument): SuperfoodBenefit {
		return new SuperfoodBenefit(
			doc.id,
			doc.name,
			doc.iconId,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toPersistence(entity: SuperfoodBenefit): any {
		return {
			id: entity.id,
			name: entity.name,
			iconId: entity.iconId,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
