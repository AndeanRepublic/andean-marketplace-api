import { ExperienceBasicInfo } from '../../../domain/entities/experiences/ExperienceBasicInfo';

export abstract class ExperienceBasicInfoRepository {
	abstract getAll(): Promise<ExperienceBasicInfo[]>;
	abstract getById(id: string): Promise<ExperienceBasicInfo | null>;
	abstract save(entity: ExperienceBasicInfo): Promise<ExperienceBasicInfo>;
	abstract update(
		id: string,
		entity: Partial<ExperienceBasicInfo>,
	): Promise<ExperienceBasicInfo>;
	abstract delete(id: string): Promise<void>;
}
