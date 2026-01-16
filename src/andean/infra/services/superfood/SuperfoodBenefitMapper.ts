import { SuperfoodBenefitDocument } from '../../persistence/superfood/superfoodBenefit.schema';
import { SuperfoodBenefit } from '../../../domain/entities/superfoods/SuperfoodBenefit';
import { CreateSuperfoodBenefitDto } from '../../controllers/dto/superfoods/CreateSuperfoodBenefitDto';
import { SuperfoodBenefitResponse } from '../../../app/modules/SuperfoodBenefitResponse';
import * as crypto from 'crypto';

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

	static fromCreateDto(dto: CreateSuperfoodBenefitDto): SuperfoodBenefit {
		return new SuperfoodBenefit(
			crypto.randomUUID(),
			dto.name,
			dto.iconId,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodBenefit): SuperfoodBenefitResponse {
		return {
			id: entity.id,
			name: entity.name,
			iconId: entity.iconId,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
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
