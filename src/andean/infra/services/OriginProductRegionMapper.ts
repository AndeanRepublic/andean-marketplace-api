import { OriginProductRegionDocument } from '../persistence/originProductRegion.schema';
import { OriginProductRegion } from '../../domain/entities/origin/OriginProductRegion';
import { CreateOriginProductRegionDto } from '../controllers/dto/origin/CreateOriginProductRegionDto';
import * as crypto from 'crypto';

export class OriginProductRegionMapper {
	static fromDocument(doc: OriginProductRegionDocument): OriginProductRegion {
		return new OriginProductRegion(
			doc.id,
			doc.name,
		);
	}

	static toDocument(dto: CreateOriginProductRegionDto): Partial<OriginProductRegionDocument> {
		return {
			id: crypto.randomUUID(),
			name: dto.name,
		};
	}
}
