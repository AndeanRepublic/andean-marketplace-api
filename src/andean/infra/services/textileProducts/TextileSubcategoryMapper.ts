import { TextileSubcategory } from 'src/andean/domain/entities/textileProducts/TextileSubcategory';
import { TextileSubcategoryDocument } from '../../persistence/textileProducts/textileSubcategory.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileSubcategoryDto } from '../../controllers/dto/textileProducts/CreateTextileSubcategoryDto';
import { Types } from 'mongoose';

export class TextileSubcategoryMapper {
	static fromDocument(doc: TextileSubcategoryDocument): TextileSubcategory {
		const plain = doc.toObject();
		return plainToInstance(TextileSubcategory, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateTextileSubcategoryDto): TextileSubcategory {
		const { ...textileSubcategoryData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...textileSubcategoryData,
		};
		return plainToInstance(TextileSubcategory, plain);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateTextileSubcategoryDto,
	): TextileSubcategory {
		const { ...textileSubcategoryData } = dto;
		const plain = {
			id: id,
			...textileSubcategoryData,
		};
		return plainToInstance(TextileSubcategory, plain);
	}

	static toPersistence(textileSubcategory: TextileSubcategory) {
		const plain = instanceToPlain(textileSubcategory);
		const { id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
