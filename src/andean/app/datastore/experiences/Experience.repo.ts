import { Experience } from '../../../domain/entities/experiences/Experience';

export abstract class ExperienceRepository {
	abstract getAll(): Promise<Experience[]>;
	abstract getById(id: string): Promise<Experience | null>;
	abstract save(entity: Experience): Promise<Experience>;
	abstract update(
		id: string,
		entity: Partial<Experience>,
	): Promise<Experience>;
	abstract delete(id: string): Promise<void>;
}
