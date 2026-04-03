import { SuperfoodColorCatalogDocument } from '../../persistence/superfood/superfoodColor.schema';
import { SuperfoodColor } from '../../../domain/entities/superfoods/SuperfoodColor';
import { CreateSuperfoodColorDto } from '../../controllers/dto/superfoods/CreateSuperfoodColorDto';
import { SuperfoodColorResponse } from '../../../app/models/superfoods/SuperfoodColorResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodColorMapper {
	static fromDocument(doc: SuperfoodColorCatalogDocument): SuperfoodColor {
		const plain = doc.toObject();
		return new SuperfoodColor(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
			plain.hexCodeColor,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodColorDto): SuperfoodColor {
		return new SuperfoodColor(
			new Types.ObjectId().toString(),
			dto.name,
			dto.hexCodeColor,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodColor): SuperfoodColorResponse {
		return {
			id: entity.id,
			name: entity.name,
			hexCodeColor: entity.hexCodeColor,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
	}

	static toPersistence(entity: SuperfoodColor): Record<string, unknown> {
		return {
			name: entity.name,
			hexCodeColor: entity.hexCodeColor,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
