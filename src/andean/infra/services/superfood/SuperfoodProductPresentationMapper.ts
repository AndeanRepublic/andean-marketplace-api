import { SuperfoodProductPresentationDocument } from '../../persistence/superfood/superfoodProductPresentation.schema';
import { SuperfoodProductPresentation } from '../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { CreateSuperfoodProductPresentationDto } from '../../controllers/dto/superfoods/CreateSuperfoodProductPresentationDto';
import { SuperfoodProductPresentationResponse } from '../../../app/modules/SuperfoodProductPresentationResponse';
import * as crypto from 'crypto';

export class SuperfoodProductPresentationMapper {
	static fromDocument(doc: SuperfoodProductPresentationDocument): SuperfoodProductPresentation {
		return new SuperfoodProductPresentation(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodProductPresentationDto): SuperfoodProductPresentation {
		return new SuperfoodProductPresentation(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodProductPresentation): SuperfoodProductPresentationResponse {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
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
