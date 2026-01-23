import { SuperfoodBenefitDocument } from '../../persistence/superfood/superfoodBenefit.schema';
import { SuperfoodBenefit } from '../../../domain/entities/superfoods/SuperfoodBenefit';
import { CreateSuperfoodBenefitDto } from '../../controllers/dto/superfoods/CreateSuperfoodBenefitDto';
import { SuperfoodBenefitResponse } from '../../../app/modules/SuperfoodBenefitResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodBenefitMapper {
	/**
	 * Convierte documento MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(doc: SuperfoodBenefitDocument): SuperfoodBenefit {
		const plain = doc.toObject();
		return new SuperfoodBenefit(
			MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			plain.name,
			plain.iconId,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodBenefitDto): SuperfoodBenefit {
		return new SuperfoodBenefit(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			dto.name,
			dto.iconId,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodBenefit): SuperfoodBenefitResponse {
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
	static toPersistence(entity: SuperfoodBenefit): any {
		return {
			name: entity.name,
			iconId: entity.iconId,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
