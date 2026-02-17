import { ExperienceAvailability } from 'src/andean/domain/entities/experiences/ExperienceAvailability';
import { ExperienceAvailabilityDocument } from '../../persistence/experiences/experienceAvailability.schema';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';

export class ExperienceAvailabilityMapper {
	static fromDocument(
		doc: ExperienceAvailabilityDocument,
	): ExperienceAvailability {
		const plain = doc.toObject();
		return plainToInstance(ExperienceAvailability, {
			id: plain._id.toString(),
			weeklyStartDays: plain.weeklyStartDays,
			specificAvailableDates: plain.specificAvailableDates,
			excludedDates: plain.excludedDates,
		});
	}

	static fromCreateDto(dto: any): ExperienceAvailability {
		const plain = {
			id: new Types.ObjectId().toString(),
			...dto,
		};
		return plainToInstance(ExperienceAvailability, plain);
	}

	static fromUpdateDto(id: string, dto: any): ExperienceAvailability {
		const plain = {
			id,
			...dto,
		};
		return plainToInstance(ExperienceAvailability, plain);
	}

	static toPersistence(
		entity: ExperienceAvailability | Partial<ExperienceAvailability>,
	) {
		const plain = instanceToPlain(entity);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
