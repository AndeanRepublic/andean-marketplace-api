import { ExperienceMediaInfo } from '../../../domain/entities/experiences/ExperienceMediaInfo';

export abstract class ExperienceMediaInfoRepository {
	abstract getAll(): Promise<ExperienceMediaInfo[]>;
	abstract getById(id: string): Promise<ExperienceMediaInfo | null>;
	abstract save(entity: ExperienceMediaInfo): Promise<ExperienceMediaInfo>;
	abstract update(
		id: string,
		entity: Partial<ExperienceMediaInfo>,
	): Promise<ExperienceMediaInfo>;
	abstract delete(id: string): Promise<void>;
}
