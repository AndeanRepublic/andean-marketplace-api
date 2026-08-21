import { ExperienceCategoryDocument } from '../../persistence/experiences/experienceCategory.schema';
import { ExperienceCategory } from '../../../domain/entities/experiences/ExperienceCategory';
import { CreateExperienceCategoryDto } from '../../controllers/dto/experiences/CreateExperienceCategoryDto';
import { ExperienceCategoryResponse } from '../../../app/models/experiences/ExperienceCategoryResponse';
import { ExperienceCategoryStatus } from '../../../domain/enums/ExperienceCategoryStatus';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class ExperienceCategoryMapper {
	static fromDocument(doc: ExperienceCategoryDocument): ExperienceCategory {
		const plain = doc.toObject();
		return new ExperienceCategory(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
			plain.status,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateExperienceCategoryDto): ExperienceCategory {
		return new ExperienceCategory(
			new Types.ObjectId().toString(),
			dto.name,
			dto.status ?? ExperienceCategoryStatus.ENABLED,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: ExperienceCategory): ExperienceCategoryResponse {
		return {
			id: entity.id,
			name: entity.name,
			status: entity.status,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
	}

	static toPersistence(entity: ExperienceCategory): {
		name: string;
		status: ExperienceCategoryStatus;
		createdAt: Date;
		updatedAt: Date;
	} {
		return {
			name: entity.name,
			status: entity.status,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
