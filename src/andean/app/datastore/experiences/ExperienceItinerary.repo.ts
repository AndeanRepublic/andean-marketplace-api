import { ExperienceItinerary } from '../../../domain/entities/experiences/ExperienceItinerary';

export abstract class ExperienceItineraryRepository {
	abstract getAll(): Promise<ExperienceItinerary[]>;
	abstract getById(id: string): Promise<ExperienceItinerary | null>;
	abstract getByIds(ids: string[]): Promise<ExperienceItinerary[]>;
	abstract save(entity: ExperienceItinerary): Promise<ExperienceItinerary>;
	abstract saveMany(
		entities: ExperienceItinerary[],
	): Promise<ExperienceItinerary[]>;
	abstract update(
		id: string,
		entity: Partial<ExperienceItinerary>,
	): Promise<ExperienceItinerary>;
	abstract delete(id: string): Promise<void>;
	abstract deleteMany(ids: string[]): Promise<void>;
}
