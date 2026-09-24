import { TextileCertificationDocument } from '../../persistence/textileProducts/textileCertification.schema';
import { TextileCertification } from '../../../domain/entities/textileProducts/TextileCertification';
import { CreateTextileCertificationDto } from '../../controllers/dto/textileProducts/CreateTextileCertificationDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class TextileCertificationMapper {
	static fromDocument(doc: TextileCertificationDocument): TextileCertification {
		const plain = doc.toObject();
		return new TextileCertification(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(
		dto: CreateTextileCertificationDto,
	): TextileCertification {
		const now = new Date();
		return new TextileCertification(
			new Types.ObjectId().toString(),
			dto.name,
			now,
			now,
		);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateTextileCertificationDto,
	): TextileCertification {
		const now = new Date();
		return new TextileCertification(id, dto.name, now, now);
	}

	static toPersistence(
		textileCertification: TextileCertification,
	): Record<string, unknown> {
		return {
			name: textileCertification.name,
			createdAt: textileCertification.createdAt || new Date(),
			updatedAt: textileCertification.updatedAt || new Date(),
		};
	}
}
