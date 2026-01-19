import { SuperfoodSalesUnitSizeDocument } from '../../persistence/superfood/superfoodSalesUnitSize.schema';
import { SuperfoodSalesUnitSize } from '../../../domain/entities/superfoods/SuperfoodSalesUnitSize';
import { CreateSuperfoodSalesUnitSizeDto } from '../../controllers/dto/superfoods/CreateSuperfoodSalesUnitSizeDto';
import { SuperfoodSalesUnitSizeResponse } from '../../../app/modules/SuperfoodSalesUnitSizeResponse';
import * as crypto from 'crypto';

export class SuperfoodSalesUnitSizeMapper {
	static fromDocument(doc: SuperfoodSalesUnitSizeDocument): SuperfoodSalesUnitSize {
		return new SuperfoodSalesUnitSize(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodSalesUnitSizeDto): SuperfoodSalesUnitSize {
		return new SuperfoodSalesUnitSize(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodSalesUnitSize): SuperfoodSalesUnitSizeResponse {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
	}

	static toPersistence(entity: SuperfoodSalesUnitSize): any {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
