import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { TextileStyleDocument } from '../../persistence/textileProducts/textileStyle.schema';
import { CreateTextileStyleDto } from '../../controllers/dto/textileProducts/CreateTextileStyleDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class TextileStyleMapper {
	static fromDocument(doc: TextileStyleDocument): TextileStyle {
		const plain = doc.toObject();
		return new TextileStyle(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
		);
	}

	static fromCreateDto(dto: CreateTextileStyleDto): TextileStyle {
		return new TextileStyle(new Types.ObjectId().toString(), dto.name);
	}

	static fromUpdateDto(id: string, dto: CreateTextileStyleDto): TextileStyle {
		return new TextileStyle(id, dto.name);
	}

	static toPersistence(textileStyle: TextileStyle): Record<string, unknown> {
		return { name: textileStyle.name };
	}
}
