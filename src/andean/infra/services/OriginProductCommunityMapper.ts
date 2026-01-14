import { OriginProductCommunityDocument } from '../persistence/originProductCommunity.schema';
import { OriginProductCommunity } from '../../domain/entities/origin/OriginProductCommunity';
import { CreateOriginProductCommunityDto } from '../controllers/dto/origin/CreateOriginProductCommunityDto';
import * as crypto from 'crypto';

export class OriginProductCommunityMapper {
	static fromDocument(doc: OriginProductCommunityDocument): OriginProductCommunity {
		return new OriginProductCommunity(
			doc.id,
			doc.name,
			doc.regionId,
		);
	}

	static toDocument(dto: CreateOriginProductCommunityDto): Partial<OriginProductCommunityDocument> {
		return {
			id: crypto.randomUUID(),
			name: dto.name,
			regionId: dto.regionId,
		};
	}
}
