import { SuperfoodCategoryDocument } from '../../persistence/superfood/superfoodCategory.schema';
import { SuperfoodCategory } from '../../../domain/entities/superfoods/SuperfoodCategory';
import { CreateSuperfoodCategoryDto } from '../../controllers/dto/superfoods/CreateSuperfoodCategoryDto';
import { SuperfoodCategoryResponse } from '../../../app/modules/SuperfoodCategoryResponse';
import * as crypto from 'crypto';

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

	static fromCreateDto(dto: CreateSuperfoodCategoryDto): SuperfoodCategory {
		return new SuperfoodCategory(
			crypto.randomUUID(),
			dto.name,
			dto.status || 'ENABLED',
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodCategory): SuperfoodCategoryResponse {
		return {
			id: entity.id,
			name: entity.name,
			status: entity.status,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
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
