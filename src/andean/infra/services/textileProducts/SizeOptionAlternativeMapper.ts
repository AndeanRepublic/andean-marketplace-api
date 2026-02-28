import { SizeOptionAlternative } from 'src/andean/domain/entities/textileProducts/SizeOptionAlternative';
import { SizeOptionAlternativeDocument } from '../../persistence/textileProducts/SizeOptionAlternative.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateSizeOptionAlternativeDto } from '../../controllers/dto/textileProducts/CreateSizeOptionAlternativeDto';
import { Types } from 'mongoose';

export class SizeOptionAlternativeMapper {
	static fromDocument(
		doc: SizeOptionAlternativeDocument,
	): SizeOptionAlternative {
		const plain = doc.toObject();
		return plainToInstance(SizeOptionAlternative, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(
		dto: CreateSizeOptionAlternativeDto,
	): SizeOptionAlternative {
		const { ...sizeOptionAlternativeData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...sizeOptionAlternativeData,
		};
		return plainToInstance(SizeOptionAlternative, plain);
	}

	static fromUpdateDto(
		id: string,
		dto: CreateSizeOptionAlternativeDto,
	): SizeOptionAlternative {
		const { ...sizeOptionAlternativeData } = dto;
		const plain = {
			id: id,
			...sizeOptionAlternativeData,
		};
		return plainToInstance(SizeOptionAlternative, plain);
	}

	static toPersistence(sizeOptionAlternative: SizeOptionAlternative) {
		const plain = instanceToPlain(sizeOptionAlternative);
		const { id: _id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
