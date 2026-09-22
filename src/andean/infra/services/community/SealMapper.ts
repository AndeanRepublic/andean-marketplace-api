import { Seal } from 'src/andean/domain/entities/community/Seal';
import { SealDocument } from '../../persistence/community/Seal.schema';
import { CreateSealDto } from '../../controllers/dto/community/CreateSealDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';
import { Types } from 'mongoose';

export class SealMapper {
	static fromDocument(doc: SealDocument): Seal {
		const plain = doc.toObject();
		return new Seal(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
			plain.description,
			plain.logoMediaId,
			plain.showcaseMediaId,
		);
	}

	static fromCreateDto(dto: CreateSealDto): Seal {
		return new Seal(
			new Types.ObjectId().toString(),
			dto.name,
			dto.description,
			dto.logoMediaId,
			dto.showcaseMediaId,
		);
	}

	static fromUpdateDto(id: string, dto: CreateSealDto): Seal {
		return new Seal(
			id,
			dto.name,
			dto.description,
			dto.logoMediaId,
			dto.showcaseMediaId,
		);
	}

	static toPersistence(seal: Seal): Record<string, unknown> {
		return {
			name: seal.name,
			description: seal.description,
			logoMediaId: seal.logoMediaId,
			showcaseMediaId: seal.showcaseMediaId,
		};
	}
}
