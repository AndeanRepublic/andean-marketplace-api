import { ColorOptionAlternative } from 'src/andean/domain/entities/textileProducts/ColorOptionAlternative';
import { ColorOptionAlternativeDocument } from '../../persistence/textileProducts/ColorOptionAlternative.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateColorOptionAlternativeDto } from '../../controllers/dto/textileProducts/CreateColorOptionAlternativeDto';
import { Types } from 'mongoose';

export class ColorOptionAlternativeMapper {
	static fromDocument(
		doc: ColorOptionAlternativeDocument,
	): ColorOptionAlternative {
		const plain = doc.toObject();
		return plainToInstance(ColorOptionAlternative, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(
		dto: CreateColorOptionAlternativeDto,
	): ColorOptionAlternative {
		const { ...colorOptionAlternativeData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...colorOptionAlternativeData,
		};
		return plainToInstance(ColorOptionAlternative, plain);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateColorOptionAlternativeDto,
	): ColorOptionAlternative {
		const { ...colorOptionAlternativeData } = dto;
		const plain = {
			id: id,
			...colorOptionAlternativeData,
		};
		return plainToInstance(ColorOptionAlternative, plain);
	}

	static toPersistence(colorOptionAlternative: ColorOptionAlternative) {
		const plain = instanceToPlain(colorOptionAlternative);
		const { id: _id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
