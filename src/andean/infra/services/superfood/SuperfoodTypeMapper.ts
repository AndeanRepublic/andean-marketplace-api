import { SuperfoodTypeDocument } from '../../persistence/superfood/superfoodType.schema';
import { SuperfoodType } from '../../../domain/entities/superfoods/SuperfoodType';
import { CreateSuperfoodTypeDto } from '../../controllers/dto/superfoods/CreateSuperfoodTypeDto';
import { SuperfoodTypeResponse } from '../../../app/modules/SuperfoodTypeResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodTypeMapper {
	/**
	 * Convierte documento MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(doc: SuperfoodTypeDocument): SuperfoodType {
		const plain = doc.toObject();
		return new SuperfoodType(
			MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			plain.name,
			plain.createdAt,
			plain.updatedAt
		);
	}

	static fromCreateDto(dto: CreateSuperfoodTypeDto): SuperfoodType {
		return new SuperfoodType(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
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

	/**
	 * Convierte entidad a formato de persistencia
	 * Excluye 'id' ya que MongoDB usará _id automáticamente
	 */
	static toPersistence(entity: SuperfoodType): any {
		return {
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}

}
