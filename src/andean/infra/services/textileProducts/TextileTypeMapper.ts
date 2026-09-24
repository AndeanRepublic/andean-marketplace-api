import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { TextileTypeDocument } from '../../persistence/textileProducts/textileType.schema';
import { CreateTextileTypeDto } from '../../controllers/dto/textileProducts/CreateTextileTypeDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class TextileTypeMapper {
	static fromDocument(doc: TextileTypeDocument): TextileType {
		const plain = doc.toObject();
		return new TextileType(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
		);
	}

	static fromCreateDto(dto: CreateTextileTypeDto): TextileType {
		return new TextileType(new Types.ObjectId().toString(), dto.name);
	}

	static fromUpdateDto(id: string, dto: CreateTextileTypeDto): TextileType {
		return new TextileType(id, dto.name);
	}

	static toPersistence(textileType: TextileType): Record<string, unknown> {
		return { name: textileType.name };
	}
}
