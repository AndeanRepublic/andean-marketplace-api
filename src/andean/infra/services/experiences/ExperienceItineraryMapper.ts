import { ExperienceItinerary } from 'src/andean/domain/entities/experiences/ExperienceItinerary';
import { ExperienceItineraryDocument } from '../../persistence/experiences/experienceItinerary.schema';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Types } from 'mongoose';
import { ItinerarySchedule } from 'src/andean/domain/entities/experiences/ItinerarySchedule';

export class ExperienceItineraryMapper {
	static fromDocument(
		doc: ExperienceItineraryDocument,
	): ExperienceItinerary {
		const plain = doc.toObject();
		const schedule = (plain.schedule || []).map((s: any) =>
			plainToInstance(ItinerarySchedule, {
				time: s.time,
				activity: s.activity,
			}),
		);

		return plainToInstance(ExperienceItinerary, {
			id: plain._id.toString(),
			numberDay: plain.numberDay,
			nameDay: plain.nameDay,
			descriptionDay: plain.descriptionDay,
			photos: plain.photos,
			schedule,
		});
	}

	static fromCreateDto(dto: any): ExperienceItinerary {
		const schedule = (dto.schedule || []).map((s: any) =>
			plainToInstance(ItinerarySchedule, s),
		);

		const plain = {
			id: new Types.ObjectId().toString(),
			numberDay: dto.numberDay,
			nameDay: dto.nameDay,
			descriptionDay: dto.descriptionDay,
			photos: dto.photos || [],
			schedule,
		};
		return plainToInstance(ExperienceItinerary, plain);
	}

	static fromUpdateDto(id: string, dto: any): ExperienceItinerary {
		const schedule = (dto.schedule || []).map((s: any) =>
			plainToInstance(ItinerarySchedule, s),
		);

		const plain = {
			id,
			numberDay: dto.numberDay,
			nameDay: dto.nameDay,
			descriptionDay: dto.descriptionDay,
			photos: dto.photos || [],
			schedule,
		};
		return plainToInstance(ExperienceItinerary, plain);
	}

	static toPersistence(
		entity: ExperienceItinerary | Partial<ExperienceItinerary>,
	) {
		const plain = instanceToPlain(entity);
		const { id, _id, __v, ...dataForDB } = plain;
		return dataForDB;
	}
}
