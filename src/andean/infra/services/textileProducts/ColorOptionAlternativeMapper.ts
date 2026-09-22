import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { ColorOptionAlternativeDocument } from '../../persistence/textileProducts/ColorOptionAlternative.schema';
import { CreateColorOptionAlternativeDto } from '../../controllers/dto/textileProducts/CreateColorOptionAlternativeDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class ColorOptionAlternativeMapper {
	static fromDocument(
		doc: ColorOptionAlternativeDocument,
	): ColorOptionAlternative {
		const plain = doc.toObject();
		return new ColorOptionAlternative(
			MongoIdUtils.objectIdToString(plain._id),
			plain.nameLabel,
			plain.hexCode,
		);
	}

	static fromCreateDto(
		dto: CreateColorOptionAlternativeDto,
	): ColorOptionAlternative {
		return new ColorOptionAlternative(
			new Types.ObjectId().toString(),
			dto.nameLabel,
			dto.hexCode,
		);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateColorOptionAlternativeDto,
	): ColorOptionAlternative {
		return new ColorOptionAlternative(id, dto.nameLabel, dto.hexCode);
	}

	static toPersistence(
		colorOptionAlternative: ColorOptionAlternative,
	): Record<string, unknown> {
		return {
			nameLabel: colorOptionAlternative.nameLabel,
			hexCode: colorOptionAlternative.hexCode,
		};
	}
}
