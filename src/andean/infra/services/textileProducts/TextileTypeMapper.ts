import { TextileType } from 'src/andean/domain/entities/textileProducts/TextileType';
import { TextileTypeDocument } from '../../persistence/textileProducts/textileType.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextileTypeDto } from '../../controllers/dto/textileProducts/CreateTextileTypeDto';
import { Types } from 'mongoose';

export class TextileTypeMapper {
	static fromDocument(doc: TextileTypeDocument): TextileType {
		const plain = doc.toObject();
		return plainToInstance(TextileType, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateTextileTypeDto): TextileType {
		const { ...textileTypeData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...textileTypeData,
		};
		return plainToInstance(TextileType, plain);
	}

	static fromUpdateDto(id: string, dto: CreateTextileTypeDto): TextileType {
		const { ...textileTypeData } = dto;
		const plain = {
			id: id,
			...textileTypeData,
		};
		return plainToInstance(TextileType, plain);
	}

	static toPersistence(textileType: TextileType) {
		const plain = instanceToPlain(textileType);
		const { id: _id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
