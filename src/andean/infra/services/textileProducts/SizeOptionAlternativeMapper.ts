import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';
import { SizeOptionAlternativeDocument } from '../../persistence/textileProducts/SizeOptionAlternative.schema';
import { CreateSizeOptionAlternativeDto } from '../../controllers/dto/textileProducts/CreateSizeOptionAlternativeDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SizeOptionAlternativeMapper {
	static fromDocument(
		doc: SizeOptionAlternativeDocument,
	): SizeOptionAlternative {
		const plain = doc.toObject();
		return new SizeOptionAlternative(
			MongoIdUtils.objectIdToString(plain._id),
			plain.nameLabel,
		);
	}

	static fromCreateDto(
		dto: CreateSizeOptionAlternativeDto,
	): SizeOptionAlternative {
		return new SizeOptionAlternative(
			new Types.ObjectId().toString(),
			dto.nameLabel,
		);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateSizeOptionAlternativeDto,
	): SizeOptionAlternative {
		return new SizeOptionAlternative(id, dto.nameLabel);
	}

	static toPersistence(
		sizeOptionAlternative: SizeOptionAlternative,
	): Record<string, unknown> {
		return { nameLabel: sizeOptionAlternative.nameLabel };
	}
}
