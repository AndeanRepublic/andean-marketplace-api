import { SuperfoodPreservationMethodDocument } from '../../persistence/superfood/superfoodPreservationMethod.schema';
import { SuperfoodPreservationMethod } from '../../../domain/entities/superfoods/SuperfoodPreservationMethod';
import { CreateSuperfoodPreservationMethodDto } from '../../controllers/dto/superfoods/CreateSuperfoodPreservationMethodDto';
import { SuperfoodPreservationMethodResponse } from '../../../app/modules/superfoods/SuperfoodPreservationMethodResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodPreservationMethodMapper {
	/**
	 * Convierte documento MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(
		doc: SuperfoodPreservationMethodDocument,
	): SuperfoodPreservationMethod {
		const plain = doc.toObject();
		return new SuperfoodPreservationMethod(
			MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			plain.name,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(
		dto: CreateSuperfoodPreservationMethodDto,
	): SuperfoodPreservationMethod {
		return new SuperfoodPreservationMethod(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(
		entity: SuperfoodPreservationMethod,
	): SuperfoodPreservationMethodResponse {
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
	static toPersistence(entity: SuperfoodPreservationMethod): any {
		return {
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
