import { Experience } from 'src/andean/domain/entities/experiences/Experience';
import { ExperienceDocument } from '../../persistence/experiences/experience.schema';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

export class ExperienceMapper {
	static fromDocument(doc: ExperienceDocument): Experience {
		const plain = doc.toObject();
		return plainToInstance(Experience, {
			id: plain._id.toString(),
			status: plain.status,
			basicInfoId: plain.basicInfoId,
			mediaInfoId: plain.mediaInfoId,
			detailInfoId: plain.detailInfoId,
			pricesId: plain.pricesId,
			availabilityId: plain.availabilityId,
			itineraryIds: plain.itineraryIds,
			createdAt: plain.createdAt,
			updatedAt: plain.updatedAt,
		});
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

	static fromUpdateDto(id: string, dto: any): Experience {
		const plain = {
			id,
			...dto,
			updatedAt: new Date(),
		};
		return plainToInstance(Experience, plain);
	}

	static toPersistence(entity: Experience | Partial<Experience>) {
		const plain = instanceToPlain(entity);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
