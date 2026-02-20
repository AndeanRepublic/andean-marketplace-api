import { ExperienceDetailInfo } from '../../../domain/entities/experiences/ExperienceDetailInfo';

export abstract class ExperienceDetailInfoRepository {
	abstract getAll(): Promise<ExperienceDetailInfo[]>;
	abstract getById(id: string): Promise<ExperienceDetailInfo | null>;
	abstract save(entity: ExperienceDetailInfo): Promise<ExperienceDetailInfo>;
	abstract update(
		id: string,
		entity: Partial<ExperienceDetailInfo>,
	): Promise<ExperienceDetailInfo>;
	abstract delete(id: string): Promise<void>;
}
