import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { TextilePrincipalUseDocument } from '../../persistence/textileProducts/textilePrincipalUse.schema';
import { CreateTextilePrincipalUseDto } from '../../controllers/dto/textileProducts/CreateTextilePrincipalUseDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class TextilePrincipalUseMapper {
	static fromDocument(doc: TextilePrincipalUseDocument): TextilePrincipalUse {
		const plain = doc.toObject();
		return new TextilePrincipalUse(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
		);
	}

	static fromCreateDto(dto: CreateTextilePrincipalUseDto): TextilePrincipalUse {
		return new TextilePrincipalUse(new Types.ObjectId().toString(), dto.name);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateTextilePrincipalUseDto,
	): TextilePrincipalUse {
		return new TextilePrincipalUse(id, dto.name);
	}

	static toPersistence(
		textilePrincipalUse: TextilePrincipalUse,
	): Record<string, unknown> {
		return { name: textilePrincipalUse.name };
	}
}
