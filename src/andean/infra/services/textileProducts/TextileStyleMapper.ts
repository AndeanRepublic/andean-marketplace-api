import { TextileStyle } from 'src/andean/domain/entities/textileProducts/TextileStyle';
import { TextileStyleDocument } from '../../persistence/textileProducts/textileStyle.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileStyleDto } from '../../controllers/dto/textileProducts/CreateTextileStyleDto';
import { Types } from 'mongoose';

export class TextileStyleMapper {
	static fromDocument(doc: TextileStyleDocument): TextileStyle {
		const plain = doc.toObject();
		return plainToInstance(TextileStyle, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateTextileStyleDto): TextileStyle {
		const { ...textileStyleData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...textileStyleData,
		};
		return plainToInstance(TextileStyle, plain);
	}

	static fromUpdateDto(id: string, dto: CreateTextileStyleDto): TextileStyle {
		const { ...textileStyleData } = dto;
		const plain = {
			id: id,
			...textileStyleData,
		};
		return plainToInstance(TextileStyle, plain);
	}

	static toPersistence(textileStyle: TextileStyle) {
		const plain = instanceToPlain(textileStyle);
		const { id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
