import { WeekDay } from 'src/andean/domain/enums/WeekDay';
import { Experience } from '../../../domain/entities/experiences/Experience';
import { ExperienceStatus } from '../../../domain/enums/ExperienceStatus';

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
	status: ExperienceStatus;
}

export abstract class ExperienceRepository {
	abstract getAll(): Promise<Experience[]>;
	abstract getById(id: string): Promise<Experience | null>;
	abstract save(entity: Experience): Promise<Experience>;
	abstract update(id: string, entity: Partial<Experience>): Promise<Experience>;
	abstract delete(id: string): Promise<void>;
	abstract getAllWithFilters(
		filters: ExperienceFilters,
	): Promise<{ items: ExperienceListRawItem[]; total: number }>;
	abstract getWeeklyStartDays(experienceId: string): Promise<WeekDay[]>;
	abstract getFutureAvailableDates(experienceId: string): Promise<Date[]>;
	abstract updateStatus(
		id: string,
		status: ExperienceStatus,
	): Promise<Experience | null>;
}
