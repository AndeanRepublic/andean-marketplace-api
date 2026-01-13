import { CommunityDocument } from '../persistence/community.schema';
import { Community } from '../../domain/entities/community/Community';
import { CreateCommunityDto } from '../controllers/dto/community/CreateCommunityDto';
import * as crypto from 'crypto';

export class CommunityMapper {
	static fromDocument(doc: CommunityDocument): Community {
		return new Community(
			doc.id,
			doc.name,
			doc.createdAt,
			doc.updatedAt,
		);
	}

	static toDocument(dto: CreateCommunityDto): Partial<CommunityDocument> {
		return {
			id: crypto.randomUUID(),
			name: dto.name,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}
}
