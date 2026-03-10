import { SuperfoodCertificationDocument } from '../../persistence/superfood/superfoodCertification.schema';
import { SuperfoodCertification } from '../../../domain/entities/superfoods/SuperfoodCertification';
import { CreateSuperfoodCertificationDto } from '../../controllers/dto/superfoods/CreateSuperfoodCertificationDto';
import { SuperfoodCertificationResponse } from '../../../app/modules/superfoods/SuperfoodCertificationResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodCertificationMapper {
	/**
	 * Convierte documento MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(
		doc: SuperfoodCertificationDocument,
	): SuperfoodCertification {
		const plain = doc.toObject();
		return new SuperfoodCertification(
			MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			plain.name,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(
		dto: CreateSuperfoodCertificationDto,
	): SuperfoodCertification {
		return new SuperfoodCertification(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(
		entity: SuperfoodCertification,
	): SuperfoodCertificationResponse {
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
	static toPersistence(entity: SuperfoodCertification): any {
		return {
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
