import { SuperfoodCertificationDocument } from '../../persistence/superfood/superfoodCertification.schema';
import { SuperfoodCertification } from '../../../domain/entities/superfoods/SuperfoodCertification';
import { CreateSuperfoodCertificationDto } from '../../controllers/dto/superfoods/CreateSuperfoodCertificationDto';
import { SuperfoodCertificationResponse } from '../../../app/modules/SuperfoodCertificationResponse';
import * as crypto from 'crypto';

export class SuperfoodCertificationMapper {
	static fromDocument(doc: SuperfoodCertificationDocument): SuperfoodCertification {
		return new SuperfoodCertification(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateSuperfoodCertificationDto): SuperfoodCertification {
		return new SuperfoodCertification(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static toResponse(entity: SuperfoodCertification): SuperfoodCertificationResponse {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt!,
			updatedAt: entity.updatedAt!,
		};
	}

	static toPersistence(entity: SuperfoodCertification): any {
		return {
			id: entity.id,
			name: entity.name,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		};
	}
}
