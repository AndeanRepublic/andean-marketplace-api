import { CommunityPageInfo } from '../../../domain/entities/community/CommunityPageInfo';
import { CommunityPageInfoDocument } from '../../persistence/community/communityPageInfo.schema';

export class CommunityPageInfoMapper {
	static fromDocument(doc: CommunityPageInfoDocument): CommunityPageInfo {
		const plain = doc.toObject();
		return new CommunityPageInfo(
			plain._id.toString(),
			plain.tagline,
			plain.shortBio,
			plain.familyCount,
			plain.weaverCount,
			plain.activityYears,
			plain.infoImageMediaIds ?? [],
			plain.whatWeDoDescription,
			plain.whatWeDoImageMediaIds ?? [],
			plain.galleryPhotoMediaIds ?? [],
			plain.galleryVideoMediaId,
			plain.galleryVideoPosterMediaId,
		);
	}
}
