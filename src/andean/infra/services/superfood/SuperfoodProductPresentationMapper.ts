import { SuperfoodProductPresentationDocument } from '../../persistence/superfood/superfoodProductPresentation.schema';
import { SuperfoodProductPresentation } from '../../../domain/entities/superfoods/SuperfoodProductPresentation';
import { CreateSuperfoodProductPresentationDto } from '../../controllers/dto/superfoods/CreateSuperfoodProductPresentationDto';
import { SuperfoodProductPresentationResponse } from '../../../app/modules/SuperfoodProductPresentationResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodProductPresentationMapper {
	/**
	 * Convierte documento MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(
		doc: SuperfoodProductPresentationDocument,
	): SuperfoodProductPresentation {
		const plain = doc.toObject();
		return new SuperfoodProductPresentation(
			MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			plain.name,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(
		dto: CreateSuperfoodProductPresentationDto,
	): SuperfoodProductPresentation {
		return new SuperfoodProductPresentation(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(
		entity: SuperfoodProductPresentation,
	): SuperfoodProductPresentationResponse {
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
	static toPersistence(entity: SuperfoodProductPresentation): any {
		return {
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
