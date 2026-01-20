import { SuperfoodCategoryDocument } from '../../persistence/superfood/superfoodCategory.schema';
import { SuperfoodCategory } from '../../../domain/entities/superfoods/SuperfoodCategory';
import { CreateSuperfoodCategoryDto } from '../../controllers/dto/superfoods/CreateSuperfoodCategoryDto';
import { SuperfoodCategoryResponse } from '../../../app/modules/SuperfoodCategoryResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodCategoryMapper {
	/**
	 * Convierte documento MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(doc: SuperfoodCategoryDocument): SuperfoodCategory {
		const plain = doc.toObject();
		return new SuperfoodCategory(
			MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			plain.name,
			plain.status,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodCategoryDto): SuperfoodCategory {
		return new SuperfoodCategory(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
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

	/**
	 * Convierte entidad a formato de persistencia
	 * Excluye 'id' ya que MongoDB usará _id automáticamente
	 */
	static toPersistence(entity: SuperfoodCategory): any {
		return {
			name: entity.name,
			status: entity.status,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}

}
