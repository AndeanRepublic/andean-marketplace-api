import { SuperfoodPreservationMethodDocument } from '../../persistence/superfood/superfoodPreservationMethod.schema';
import { SuperfoodPreservationMethod } from '../../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { CreateSuperfoodPreservationMethodDto } from '../../controllers/dto/superfoods/CreateSuperfoodPreservationMethodDto';
import { SuperfoodPreservationMethodResponse } from '../../../app/modules/SuperfoodPreservationMethodResponse';
import * as crypto from 'crypto';

export class SuperfoodPreservationMethodMapper {
	static fromDocument(doc: SuperfoodPreservationMethodDocument): SuperfoodPreservationMethod {
		return new SuperfoodPreservationMethod(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodPreservationMethodDto): SuperfoodPreservationMethod {
		return new SuperfoodPreservationMethod(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodPreservationMethod): SuperfoodPreservationMethodResponse {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
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
