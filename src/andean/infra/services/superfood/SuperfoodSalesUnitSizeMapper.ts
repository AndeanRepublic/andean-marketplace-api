import { SuperfoodSalesUnitSizeDocument } from '../../persistence/superfood/superfoodSalesUnitSize.schema';
import { SuperfoodSalesUnitSize } from '../../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { CreateSuperfoodSalesUnitSizeDto } from '../../controllers/dto/superfoods/CreateSuperfoodSalesUnitSizeDto';
import { SuperfoodSalesUnitSizeResponse } from '../../../app/modules/SuperfoodSalesUnitSizeResponse';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SuperfoodSalesUnitSizeMapper {
	/**
	 * Convierte documento MongoDB a entidad de dominio
	 * ObjectId (_id) → string (id)
	 */
	static fromDocument(
		doc: SuperfoodSalesUnitSizeDocument,
	): SuperfoodSalesUnitSize {
		const plain = doc.toObject();
		return new SuperfoodSalesUnitSize(
			MongoIdUtils.objectIdToString(plain._id), // ObjectId → string
			plain.name,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(
		dto: CreateSuperfoodSalesUnitSizeDto,
	): SuperfoodSalesUnitSize {
		return new SuperfoodSalesUnitSize(
			new Types.ObjectId().toString(), // Generar ObjectId temporal como string
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(
		entity: SuperfoodSalesUnitSize,
	): SuperfoodSalesUnitSizeResponse {
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
	static toPersistence(entity: SuperfoodSalesUnitSize): any {
		return {
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
