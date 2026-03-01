import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { ExperienceDocument } from '../../persistence/experiences/experience.schema';
import { ExperienceBasicInfoMapper } from './ExperienceBasicInfoMapper';
import { ExperienceMediaInfoMapper } from './ExperienceMediaInfoMapper';
import { ExperienceDetailInfoMapper } from './ExperienceDetailInfoMapper';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

export class ExperienceMapper {
	static fromDocument(doc: ExperienceDocument): Experience {
		const plain = doc.toObject();
		return new Experience(
			plain._id.toString(),
			plain.status,
			ExperienceBasicInfoMapper.fromPlain(plain.basicInfo),
			ExperienceMediaInfoMapper.fromPlain(plain.mediaInfo),
			ExperienceDetailInfoMapper.fromPlain(plain.detailInfo),
			plain.pricesId,
			plain.availabilityId,
			plain.itineraryIds,
			plain.createdAt,
			plain.updatedAt,
		);
	}

	static fromCreateDto(dto: any): Experience {
		const plain = {
			id: new Types.ObjectId().toString(),
			...dto,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		return plainToInstance(Experience, plain);
	}

	static toPersistence(entity: Experience | Partial<Experience>) {
		const plain = instanceToPlain(entity);
		const { id: _id1, _id: _id2, __v: _v, ...dataForDB } = plain;
		return dataForDB;
	}
}
