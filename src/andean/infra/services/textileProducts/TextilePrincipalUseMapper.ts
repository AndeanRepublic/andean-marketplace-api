import { TextilePrincipalUse } from 'src/andean/domain/entities/textileProducts/TextilePrincipalUse';
import { TextilePrincipalUseDocument } from '../../persistence/textileProducts/textilePrincipalUse.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateTextilePrincipalUseDto } from '../../controllers/dto/textileProducts/CreateTextilePrincipalUseDto';
import { Types } from 'mongoose';

export class TextilePrincipalUseMapper {
	static fromDocument(doc: TextilePrincipalUseDocument): TextilePrincipalUse {
		const plain = doc.toObject();
		return plainToInstance(TextilePrincipalUse, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateTextilePrincipalUseDto): TextilePrincipalUse {
		const { ...textilePrincipalUseData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...textilePrincipalUseData,
		};
		return plainToInstance(TextilePrincipalUse, plain);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateTextilePrincipalUseDto,
	): TextilePrincipalUse {
		const { ...textilePrincipalUseData } = dto;
		const plain = {
			id: id,
			...textilePrincipalUseData,
		};
		return plainToInstance(TextilePrincipalUse, plain);
	}

	static toPersistence(textilePrincipalUse: TextilePrincipalUse) {
		const plain = instanceToPlain(textilePrincipalUse);
		const { id: _id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
