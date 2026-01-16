import { CommunityDocument } from '../persistence/community.schema';
import { Community } from '../../domain/entities/community/Community';
import { CreateCommunityDto } from '../controllers/dto/community/CreateCommunityDto';
import { UpdateCommunityDto } from '../controllers/dto/community/UpdateCommunityDto';
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

	static fromCreateDto(dto: CreateCommunityDto): Community {
		return new Community(
			crypto.randomUUID(),
			dto.name,
			new Date(),
			new Date(),
		);
	}

	static fromUpdateDto(dto: UpdateCommunityDto, existing: Community): Community {
		return new Community(
			existing.id,
			dto.name ?? existing.name,
			existing.createdAt,
			new Date(),
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
