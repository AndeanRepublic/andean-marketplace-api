import { SuperfoodNutritionalFeatureDocument } from '../../persistence/superfood/superfoodNutritionalFeature.schema';
import { SuperfoodNutritionalFeature } from '../../../domain/entities/superfoods/SuperfoodNutritionalFeature';
import { CreateSuperfoodNutritionalFeatureDto } from '../../controllers/dto/superfoods/CreateSuperfoodNutritionalFeatureDto';
import { SuperfoodNutritionalFeatureResponse } from '../../../app/modules/SuperfoodNutritionalFeatureResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodNutritionalFeatureMapper {
	/**
	 * Convierte documento MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(
		doc: SuperfoodNutritionalFeatureDocument,
	): SuperfoodNutritionalFeature {
		const plain = doc.toObject();
		return new SuperfoodNutritionalFeature(
			MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			plain.name,
			plain.iconId,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(
		dto: CreateSuperfoodNutritionalFeatureDto,
	): SuperfoodNutritionalFeature {
		return new SuperfoodNutritionalFeature(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			dto.name,
			dto.iconId,
			new Date(),
			new Date(),
		);
	}

	static toResponse(
		entity: SuperfoodNutritionalFeature,
	): SuperfoodNutritionalFeatureResponse {
		return {
			id: entity.id,
			name: entity.name,
			iconId: entity.iconId,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
	}

	/**
	 * Convierte entidad a formato de persistencia
	 * Excluye 'id' ya que MongoDB usará _id automáticamente
	 */
	static toPersistence(entity: SuperfoodNutritionalFeature): any {
		return {
			name: entity.name,
			iconId: entity.iconId,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
