import { TextileCategory } from 'src/andean/domain/entities/textileProducts/TextileCategory';
import { TextileCategoryDocument } from '../../persistence/textileProducts/textileCategory.schema';
import { CreateTextileCategoryDto } from '../../controllers/dto/textileProducts/CreateTextileCategory';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class TextileCategoryMapper {
	static fromDocument(doc: TextileCategoryDocument): TextileCategory {
		const plain = doc.toObject();
		return new TextileCategory(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
			plain.status,
		);
	}

	static fromCreateDto(dto: CreateTextileCategoryDto): TextileCategory {
		return new TextileCategory(
			new Types.ObjectId().toString(),
			dto.name,
			dto.status,
		);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateTextileCategoryDto,
	): TextileCategory {
		return new TextileCategory(id, dto.name, dto.status);
	}

	static toPersistence(
		textileCategory: TextileCategory,
	): Record<string, unknown> {
		return {
			name: textileCategory.name,
			status: textileCategory.status,
		};
	}
}
