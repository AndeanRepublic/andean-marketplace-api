import { ShopPageInfo } from '../../../domain/entities/shop/ShopPageInfo';
import { ShopPageInfoDocument } from '../../persistence/shop/shopPageInfo.schema';

export class ShopPageInfoMapper {
	static fromDocument(doc: ShopPageInfoDocument): ShopPageInfo {
		const plain = doc.toObject();
		return new ShopPageInfo(
			plain._id.toString(),
			plain.tagline,
			plain.shortBio,
			plain.historyImageMediaIds ?? [],
			plain.whatWeDoDescription,
			plain.whatWeDoImageMediaIds ?? [],
		);
	}
}
