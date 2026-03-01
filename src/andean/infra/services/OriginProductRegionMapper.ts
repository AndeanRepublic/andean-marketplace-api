import { OriginProductRegionDocument } from '../persistence/originProductRegion.schema';
import { OriginProductRegion } from '../../domain/entities/origin/OriginProductRegion';
import { CreateOriginProductRegionDto } from '../controllers/dto/origin/CreateOriginProductRegionDto';
import { UpdateOriginProductRegionDto } from '../controllers/dto/origin/UpdateOriginProductRegionDto';
import * as crypto from 'crypto';

export class OriginProductRegionMapper {
	static fromDocument(doc: OriginProductRegionDocument): OriginProductRegion {
		return new OriginProductRegion(doc.id, doc.name);
	}

	static fromCreateDto(dto: CreateOriginProductRegionDto): OriginProductRegion {
		return new OriginProductRegion(crypto.randomUUID(), dto.name);
	}

	static fromUpdateDto(
		dto: UpdateOriginProductRegionDto,
		existing: OriginProductRegion,
	): OriginProductRegion {
		return new OriginProductRegion(existing.id, dto.name ?? existing.name);
	}

	static toDocument(
		dto: CreateOriginProductRegionDto,
	): Partial<OriginProductRegionDocument> {
		return {
			id: crypto.randomUUID(),
			name: dto.name,
		};
	}
}
