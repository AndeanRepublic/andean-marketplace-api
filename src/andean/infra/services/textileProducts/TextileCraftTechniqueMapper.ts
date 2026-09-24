import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { TextileCraftTechniqueDocument } from '../../persistence/textileProducts/textileCraftTechnique.schema';
import { CreateTextileCraftTechniqueDto } from '../../controllers/dto/textileProducts/CreateTextileCraftTechniqueDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class TextileCraftTechniqueMapper {
	static fromDocument(
		doc: TextileCraftTechniqueDocument,
	): TextileCraftTechnique {
		const plain = doc.toObject();
		return new TextileCraftTechnique(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
		);
	}

	static fromCreateDto(
		dto: CreateTextileCraftTechniqueDto,
	): TextileCraftTechnique {
		return new TextileCraftTechnique(
			new Types.ObjectId().toString(),
			dto.name,
		);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateTextileCraftTechniqueDto,
	): TextileCraftTechnique {
		return new TextileCraftTechnique(id, dto.name);
	}

	static toPersistence(
		textileCraftTechnique: TextileCraftTechnique,
	): Record<string, unknown> {
		return { name: textileCraftTechnique.name };
	}
}
