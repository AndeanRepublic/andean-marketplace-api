import { instanceToPlain } from 'class-transformer';
import { Types } from 'mongoose';
import { BoxSeal } from '../../../domain/entities/box/BoxSeal';
import { BoxSealDocument } from '../../persistence/box/boxSeal.schema';
import { CreateBoxSealDto } from '../../controllers/dto/box/CreateBoxSealDto';
import { MongoIdUtils } from '../../utils/MongoIdUtils';

export class BoxSealMapper {
	static fromDocument(doc: BoxSealDocument): BoxSeal {
		const plain = doc.toObject() as BoxSealDocument;
		return new BoxSeal(
			MongoIdUtils.objectIdToString(plain._id),
			plain.name,
			plain.description,
			plain.logoMediaId,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: CreateBoxSealDto): BoxSeal {
		const id = new Types.ObjectId().toString();
		const now = new Date();
		return new BoxSeal(
			id,
			dto.name,
			dto.description,
			dto.logoMediaId,
			now,
			now,
		);
	}

	static toPersistence(boxSeal: BoxSeal | Partial<BoxSeal>) {
		const plain = instanceToPlain(boxSeal);
		const { id: _id1, _id: _id2, __v: _v, ...dataForDB } = plain;
		return dataForDB;
	}
}
