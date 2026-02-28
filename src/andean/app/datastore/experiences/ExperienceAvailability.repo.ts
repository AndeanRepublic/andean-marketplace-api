import { ExperienceAvailability } from '../../../domain/entities/experiences/ExperienceAvailability';

export abstract class ExperienceAvailabilityRepository {
	abstract getAll(): Promise<ExperienceAvailability[]>;
	abstract getById(id: string): Promise<ExperienceAvailability | null>;
	abstract save(
		entity: ExperienceAvailability,
	): Promise<ExperienceAvailability>;
	abstract update(
		id: string,
		entity: Partial<ExperienceAvailability>,
	): Promise<ExperienceAvailability>;
	abstract delete(id: string): Promise<void>;
}
