import { Seal } from 'src/andean/domain/entities/community/Seal';
import { SealDocument } from '../../persistence/community/Seal.schema';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CreateSealDto } from '../../controllers/dto/community/CreateSealDto';
import { Types } from 'mongoose';

export class SealMapper {
	static fromDocument(doc: SealDocument): Seal {
		const plain = doc.toObject();
		return plainToInstance(Seal, {
			id: plain._id.toString(),
			...plain,
		});
	}

	static fromCreateDto(dto: CreateSealDto): Seal {
		const { ...sealData } = dto;
		const plain = {
			id: new Types.ObjectId().toString(),
			...sealData,
		};
		return plainToInstance(Seal, plain);
	}

	static fromUpdateDto(id: string, dto: CreateSealDto): Seal {
		const { ...sealData } = dto;
		const plain = {
			id: id,
			...sealData,
		};
		return plainToInstance(Seal, plain);
	}

	static toPersistence(seal: Seal) {
		const plain = instanceToPlain(seal);
		const { id, ...updateData } = plain;

		return {
			...updateData,
		};
	}
}
