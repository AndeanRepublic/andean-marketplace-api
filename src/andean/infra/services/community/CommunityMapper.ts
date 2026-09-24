import { CommunityDocument } from '../../persistence/community/community.schema';
import { Community } from '../../../domain/entities/community/Community';
import { CreateCommunityDto } from '../../controllers/dto/community/CreateCommunityDto';
import { Types } from 'mongoose';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { AdminEntityStatus } from '../../../domain/enums/AdminEntityStatus';

type CommunityCreateInput = CreateCommunityDto & {
	providerInfoId?: string;
	pageInfoId?: string;
};

export class CommunityMapper {
	static fromDocument(doc: CommunityDocument): Community {
		const plain = doc.toObject();
		return new Community(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
			plain.bannerImageId,
			plain.status === AdminEntityStatus.PUBLISHED
				? AdminEntityStatus.PUBLISHED
				: AdminEntityStatus.HIDDEN,
			plain.createdAt,
			plain.updatedAt,
			plain.seals,
			plain.providerInfoId,
			plain.activePage ?? false,
			plain.pageInfoId,
		);
	}

	static fromCreateDto(dto: CommunityCreateInput): Community {
		const now = new Date();
		return new Community(
			new Types.ObjectId().toString(),
			dto.name,
			dto.bannerImageId,
			AdminEntityStatus.HIDDEN,
			now,
			now,
			dto.seals,
			dto.providerInfoId,
			dto.activePage ?? false,
			dto.pageInfoId,
		);
	}

	static toPersistence(
		community: Community | Partial<Community>,
	): Record<string, unknown> {
		const data: Record<string, unknown> = {};
		if (community.name !== undefined) data.name = community.name;
		if (community.bannerImageId !== undefined) {
			data.bannerImageId = community.bannerImageId;
		}
		if (community.status !== undefined) data.status = community.status;
		if (community.seals !== undefined) data.seals = community.seals;
		if (community.providerInfoId !== undefined) {
			data.providerInfoId = community.providerInfoId;
		}
		if (community.activePage !== undefined) {
			data.activePage = community.activePage;
		}
		if (community.pageInfoId !== undefined) data.pageInfoId = community.pageInfoId;
		if (community.createdAt !== undefined) data.createdAt = community.createdAt;
		if (community.updatedAt !== undefined) data.updatedAt = community.updatedAt;
		return data;
	}
}
