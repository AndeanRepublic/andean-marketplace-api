import { Injectable, Inject } from '@nestjs/common';
import {
	ExperienceRepository,
	ExperienceFilters,
} from '../../datastore/experiences/Experience.repo';
import {
	PaginatedExperiencesResponse,
	ExperienceListItem,
} from '../../models/experiences/ExperienceListItemResponse';

@Injectable()
export class GetAllExperiencesUseCase {
	constructor(
		@Inject(ExperienceRepository)
		private readonly experienceRepository: ExperienceRepository,
	) {}

	async handle(
		filters?: ExperienceFilters,
	): Promise<PaginatedExperiencesResponse> {
		const page = filters?.page || 1;
		const perPage = filters?.perPage || 20;

		const { items, total } = await this.experienceRepository.getAllWithFilters(
			filters || { page, perPage },
		);

		const experiences: ExperienceListItem[] = items.map((raw) => ({
			id: raw.id,
			title: raw.title,
			ownerName: raw.ownerName,
			price: raw.adultsPrice,
			place: raw.ubication,
			days: raw.days,
			mainImage: {
				name: raw.mainImageName,
				url: raw.mainImageUrl,
			},
		}));

		return {
			experiences,
			pagination: {
				total,
				page,
				per_page: perPage,
			},
		};
	}
}
