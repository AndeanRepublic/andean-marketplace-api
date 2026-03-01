import { TextileCraftTechnique } from 'src/andean/domain/entities/textileProducts/TextileCraftTechnique';
import { TextileCraftTechniqueDocument } from '../../persistence/textileProducts/textileCraftTechnique.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileCraftTechniqueDto } from '../../controllers/dto/textileProducts/CreateTextileCraftTechniqueDto';
import { Types } from 'mongoose';

export class TextileCraftTechniqueMapper {
	static fromDocument(
		doc: TextileCraftTechniqueDocument,
	): TextileCraftTechnique {
		const plain = doc.toObject();
		return plainToInstance(TextileCraftTechnique, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(
		dto: CreateTextileCraftTechniqueDto,
	): TextileCraftTechnique {
		const { ...textileCraftTechniqueData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...textileCraftTechniqueData,
		};
		return plainToInstance(TextileCraftTechnique, plain);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateTextileCraftTechniqueDto,
	): TextileCraftTechnique {
		const { ...textileCraftTechniqueData } = dto;
		const plain = {
			id: id,
			...textileCraftTechniqueData,
		};
		return plainToInstance(TextileCraftTechnique, plain);
	}

	static toPersistence(textileCraftTechnique: TextileCraftTechnique) {
		const plain = instanceToPlain(textileCraftTechnique);
		const { id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
