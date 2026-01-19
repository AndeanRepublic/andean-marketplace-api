import { SuperfoodTypeDocument } from '../../persistence/superfood/superfoodType.schema';
import { SuperfoodType } from '../../../domain/entities/superfoods/SuperfoodType';
import { CreateSuperfoodTypeDto } from '../../controllers/dto/superfoods/CreateSuperfoodTypeDto';
import { SuperfoodTypeResponse } from '../../../app/modules/SuperfoodTypeResponse';
import * as crypto from 'crypto';

export class SuperfoodTypeMapper {
	static fromDocument(doc: SuperfoodTypeDocument): SuperfoodType {
		return new SuperfoodType(doc.id, doc.name, doc.createdAt, doc.updatedAt);
	}

	static fromCreateDto(dto: CreateSuperfoodTypeDto): SuperfoodType {
		return new SuperfoodType(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodType): SuperfoodTypeResponse {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
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
