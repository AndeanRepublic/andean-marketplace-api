import { OriginProductCommunityDocument } from '../persistence/originProductCommunity.schema';
import { OriginProductCommunity } from '../../domain/entities/origin/OriginProductCommunity';
import { CreateOriginProductCommunityDto } from '../controllers/dto/origin/CreateOriginProductCommunityDto';
import { UpdateOriginProductCommunityDto } from '../controllers/dto/origin/UpdateOriginProductCommunityDto';
import * as crypto from 'crypto';

export class OriginProductCommunityMapper {
	static fromDocument(
		doc: OriginProductCommunityDocument,
	): OriginProductCommunity {
		return new OriginProductCommunity(doc.id, doc.name, doc.regionId);
	}

	static fromCreateDto(
		dto: CreateOriginProductCommunityDto,
	): OriginProductCommunity {
		return new OriginProductCommunity(
			crypto.randomUUID(),
			dto.name,
			dto.regionId,
		);
	}

	static fromUpdateDto(
		dto: UpdateOriginProductCommunityDto,
		existing: OriginProductCommunity,
	): OriginProductCommunity {
		return new OriginProductCommunity(
			existing.id,
			dto.name ?? existing.name,
			dto.regionId ?? existing.regionId,
		);
	}

	static toDocument(
		dto: CreateOriginProductCommunityDto,
	): Partial<OriginProductCommunityDocument> {
		return {
			id: crypto.randomUUID(),
			name: dto.name,
			regionId: dto.regionId,
		};
	}
}
