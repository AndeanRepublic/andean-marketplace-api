import { Experience } from '../../../domain/entities/experiences/Experience';

export interface ExperienceFilters {
	page?: number;
	perPage?: number;
	category?: string;
	ownerId?: string;
	minPrice?: number;
	maxPrice?: number;
}

export interface ExperienceListRawItem {
	id: string;
	title: string;
	ownerName: string;
	adultsPrice: number;
	ubication: string;
	days: number;
	mainImageName: string;
	mainImageUrl: string;
}

export abstract class ExperienceRepository {
	abstract getAll(): Promise<Experience[]>;
	abstract getById(id: string): Promise<Experience | null>;
	abstract save(entity: Experience): Promise<Experience>;
	abstract update(
		id: string,
		entity: Partial<Experience>,
	): Promise<Experience>;
	abstract delete(id: string): Promise<void>;
	abstract getAllWithFilters(
		filters: ExperienceFilters,
	): Promise<{ items: ExperienceListRawItem[]; total: number }>;
}
