import { FounderInfo } from '../../../domain/entities/shop/FounderInfo';
import { FounderInfoDocument } from '../../persistence/shop/founderInfo.schema';

export class FounderInfoMapper {
	static fromDocument(doc: FounderInfoDocument): FounderInfo {
		const plain = doc.toObject();
		return new FounderInfo(
			plain._id.toString(),
			plain.founderName,
			plain.founderImage,
		);
	}
}
