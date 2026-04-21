import { Injectable } from '@nestjs/common';
import { ExperienceFilters } from '../../datastore/experiences/Experience.repo';
import { PaginatedExperiencesResponse } from '../../models/experiences/ExperienceListItemResponse';
import { GetAllExperiencesUseCase } from './GetAllExperiencesUseCase';

@Injectable()
export class GetAllExperiencesForManagementUseCase {
	constructor(
		private readonly getAllExperiencesUseCase: GetAllExperiencesUseCase,
	) {}

	async handle(
		filters?: ExperienceFilters,
	): Promise<PaginatedExperiencesResponse> {
		return this.getAllExperiencesUseCase.handle(filters);
	}
}
